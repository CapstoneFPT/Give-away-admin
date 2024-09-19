import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  CategoryApi,
  CategoryTreeNode,
  CreateCategoryRequest,
} from "../../../api";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { showAlert } from "../../../utils/Alert";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryTreeNode | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<CategoryTreeNode | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery("categories", () => {
    const categoryApi = new CategoryApi();
    return categoryApi.apiCategoriesTreeGet();
  });

  useEffect(() => {
    if (data) {
      setCategories(data.data.categories || []);
    }
  }, [data]);

  const addCategoryMutation = useMutation(
    (newCategory: CreateCategoryRequest) => {
      const categoryApi = new CategoryApi();
      return categoryApi.apiCategoriesCategoryIdPost(
        selectedCategory?.categoryId || "",
        {
          name: newCategory.name,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        showAlert("success", "Category added successfully");
        setNewCategoryName("");
        setSelectedCategory(null);
      },
      onError: (error) => {
        showAlert(
          "error",
          "Failed to add category: " + (error as Error).message
        );
      },
    }
  );

  const updateCategoryMutation = useMutation(
    (updatedCategory: { categoryId: string; name: string }) => {
      const categoryApi = new CategoryApi();
      return categoryApi.apiCategoriesCategoryIdPut(
        updatedCategory.categoryId,
        {
          name: updatedCategory.name,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        showAlert("success", "Category updated successfully");
        setEditingCategory(null);
        setEditCategoryName("");
      },
      onError: (error) => {
        showAlert(
          "error",
          "Failed to update category: " + (error as Error).message
        );
      },
    }
  );

  const updateCategoryStatusMutation = useMutation(
    (updatedCategory: { categoryId: string }) => {
      const categoryApi = new CategoryApi();
      return categoryApi.apiCategoriesCategoryIdStatusPut(
        updatedCategory.categoryId
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        showAlert("success", "Category status updated successfully");
      },
      onError: (error) => {
        showAlert(
          "error",
          "Failed to update category status: " + (error as Error).message
        );
      },
    }
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategoryList = (nodes: CategoryTreeNode[], level: number = 0) => {
    return (
      <ul className="list-unstyled ms-4">
        {nodes.map((node) => (
          <li key={node.categoryId} className="mb-2">
            <div className="d-flex align-items-center">
              {node.children && node.children.length > 0 && (
                <button
                  className="btn btn-sm btn-link p-0 me-2"
                  onClick={() => toggleCategory(node.categoryId || "")}
                >
                  <i
                    className={`bi ${
                      expandedCategories.includes(node.categoryId || "")
                        ? "bi-chevron-down"
                        : "bi-chevron-right"
                    }`}
                  ></i>
                </button>
              )}
              <span
                className={`cursor-pointer ${
                  selectedCategory?.categoryId === node.categoryId
                    ? "text-primary"
                    : ""
                } ${level === 0 ? "fw-bold" : ""}`}
              >
                {node.name}
              </span>
              {level < 3 && (
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={() => setSelectedCategory(node)}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => handleEditCategory(node)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className={`btn btn-sm ${
                  node.status === "Available"
                    ? "btn-outline-danger"
                    : "btn-outline-success"
                } ms-2`}
                onClick={() => handleToggleStatus(node)}
              >
                {node.status === "Available" ? "Disable" : "Activate"}
              </button>
            </div>
            {expandedCategories.includes(node.categoryId || "") &&
              node.children &&
              renderCategoryList(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName && (selectedCategory || categories.length === 0)) {
      addCategoryMutation.mutate({
        name: newCategoryName,
      });
    } else {
      showAlert(
        "error",
        "Please select a category (if not root) and enter a name"
      );
    }
  };

  const handleEditCategory = (category: CategoryTreeNode) => {
    setEditingCategory(category);
    setEditCategoryName(category.name || "");
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editCategoryName) {
      updateCategoryMutation.mutate({
        categoryId: editingCategory.categoryId || "",
        name: editCategoryName,
      });
    }
  };

  const handleToggleStatus = (category: CategoryTreeNode) => {
    updateCategoryStatusMutation.mutate({
      categoryId: category.categoryId || "",
    });
  };

  if (isLoading)
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-danger">
        An error occurred: {(error as Error).message}
      </div>
    );

  return (
    <KTCard>
      <KTCardBody>
        <h1 className="mb-4 fw-bold d-flex justify-content-center mb-15">
          Category Management
        </h1>
        <div className="row">
          <div className="col-md-6">
            <h3 className="fw-bold">Category List</h3>
            <p className="text-muted">
              Click on '+' to expand categories or add subcategories. You can
              add up to 4 levels of categories.
            </p>
            {renderCategoryList(categories)}
          </div>
          <div className="col-md-6">
            {editingCategory ? (
              <>
                <h3>Edit Category: {editingCategory.name}</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleUpdateCategory}
                    disabled={!editCategoryName}
                  >
                    Update Category
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>
                  {selectedCategory
                    ? `Add Subcategory to ${selectedCategory.name}`
                    : "Add Root Category"}
                </h3>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                  />
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleAddCategory}
                    disabled={!newCategoryName}
                  >
                    Add Category
                  </button>
                  {selectedCategory && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </>
            )}
            {selectedCategory && !editingCategory && (
              <div className="card mt-4">
                <div className="card-body">
                  <h4 className="card-title">Selected Category Details</h4>
                  <p className="card-text">Name: {selectedCategory.name}</p>
                  <p className="card-text">
                    Status:{" "}
                    {selectedCategory.status === "Available"
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default CategoryManagement;
