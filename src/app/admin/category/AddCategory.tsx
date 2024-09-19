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
        <h2 className="mb-4">Category Management</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>Category List</h3>
            <p className="text-muted">
              Click on '+' to expand categories or add subcategories. You can
              add up to 4 levels of categories.
            </p>
            {renderCategoryList(categories)}
          </div>
          <div className="col-md-6">
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
            {selectedCategory && (
              <div className="card mt-4">
                <div className="card-body">
                  <h4 className="card-title">Selected Category Details</h4>
                  <p className="card-text">Name: {selectedCategory.name}</p>
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
