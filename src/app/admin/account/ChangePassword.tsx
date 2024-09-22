/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { AuthApi } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { showAlert } from "../../../utils/Alert";
import { AxiosError } from "axios";
import { useAuth } from "../../../app/modules/auth";
interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null!], "Passwords must match")
    .required("Please confirm your new password"),
});

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authApi = new AuthApi();
  const accountId = useAuth().currentUser?.id;
  const changePasswordMutation = useMutation(
    (data: ChangePasswordForm) =>
      authApi.apiAuthAccountIdChangePasswordPut(accountId!, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }),
    {
      onSuccess: () => {
        showAlert("success", "Password changed successfully");
        formik.resetForm();
      },

      onError: (error: AxiosError) => {
        showAlert(
          "error",
          `Failed to change password: ${
            (error.response?.data as any)?.messages ||
            (error.response?.data as any)?.errors.NewPassword
          }`
        );
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const formik = useFormik<ChangePasswordForm>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      changePasswordMutation.mutate({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
    },
  });

  return (
    <Content>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Change Password</h3>
        </div>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                    ? "is-invalid"
                    : ""
                }`}
                id="currentPassword"
                {...formik.getFieldProps("currentPassword")}
              />
              {formik.touched.currentPassword &&
                formik.errors.currentPassword && (
                  <div className="invalid-feedback">
                    {formik.errors.currentPassword}
                  </div>
                )}
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "is-invalid"
                    : ""
                }`}
                id="newPassword"
                {...formik.getFieldProps("newPassword")}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="invalid-feedback">
                  {formik.errors.newPassword}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmNewPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword
                    ? "is-invalid"
                    : ""
                }`}
                id="confirmNewPassword"
                {...formik.getFieldProps("confirmNewPassword")}
              />
              {formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword && (
                  <div className="invalid-feedback">
                    {formik.errors.confirmNewPassword}
                  </div>
                )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </Content>
  );
};

export default ChangePassword;
