import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { AuthApi } from "../../../../api";

const initialValues = {
  email: "",
  newPassword: "",
  confirmNewPassword: "",
  otp: "",
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  newPassword: Yup.string()
    .min(6, "Minimum 6 characters")
    .max(50, "Maximum 50 characters")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null!], "Passwords must match")
    .required("Confirm new password is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const authApi = new AuthApi();

  const formik = useFormik({
    initialValues,
    validationSchema: showOtpField ? otpSchema : forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      setSuccessMessage(null);

      if (!showOtpField) {
        // Step 1: Send password reset request
        authApi
          .apiAuthForgotPasswordGet(
            values.email,
            values.newPassword,
            values.confirmNewPassword
          )
          .then(() => {
            setShowOtpField(true);
            setSuccessMessage(
              "OTP sent to your email. Please check your inbox."
            );
          })
          .catch((error) => {
            setHasErrors(true);
            setStatus(
              error.response?.data?.messages?.[0] ||
                "An error occurred. Please try again."
            );
          })
          .finally(() => {
            setLoading(false);
            setSubmitting(false);
          });
      } else {
        // Step 2: Verify OTP and reset password
        authApi
          .apiAuthResetPasswordPut(values.otp)
          .then(() => {
            setSuccessMessage(
              "Password reset successfully. You can now login with your new password."
            );
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 3000);
          })
          .catch((error) => {
            setHasErrors(true);
            setStatus(
              error.response?.data?.messages?.[0] ||
                "Invalid OTP. Please try again."
            );
          })
          .finally(() => {
            setLoading(false);
            setSubmitting(false);
          });
      }
    },
  });

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_password_reset_form"
      onSubmit={formik.handleSubmit}
    >
      <div className="text-center mb-10">
        <h1 className="text-gray-900 fw-bolder mb-3">Forgot Password?</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          Enter your email and new password to reset your password.
        </div>
      </div>

      {hasErrors === true && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      )}

      {successMessage && (
        <div className="mb-10 bg-light-info p-8 rounded">
          <div className="text-info">{successMessage}</div>
        </div>
      )}

      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">Email</label>
        <input
          type="email"
          placeholder="Email"
          autoComplete="off"
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.email && formik.errors.email },
            { "is-valid": formik.touched.email && !formik.errors.email }
          )}
          disabled={showOtpField}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          New Password
        </label>
        <input
          type="password"
          placeholder="New Password"
          autoComplete="off"
          {...formik.getFieldProps("newPassword")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid":
                formik.touched.newPassword && formik.errors.newPassword,
            },
            {
              "is-valid":
                formik.touched.newPassword && !formik.errors.newPassword,
            }
          )}
          disabled={showOtpField}
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.newPassword}</span>
            </div>
          </div>
        )}
      </div>

      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Confirm New Password"
          autoComplete="off"
          {...formik.getFieldProps("confirmNewPassword")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid":
                formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword,
            },
            {
              "is-valid":
                formik.touched.confirmNewPassword &&
                !formik.errors.confirmNewPassword,
            }
          )}
          disabled={showOtpField}
        />
        {formik.touched.confirmNewPassword &&
          formik.errors.confirmNewPassword && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.confirmNewPassword}</span>
              </div>
            </div>
          )}
      </div>

      {showOtpField && (
        <div className="fv-row mb-8">
          <label className="form-label fw-bolder text-gray-900 fs-6">OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            autoComplete="off"
            {...formik.getFieldProps("otp")}
            className={clsx(
              "form-control bg-transparent",
              { "is-invalid": formik.touched.otp && formik.errors.otp },
              { "is-valid": formik.touched.otp && !formik.errors.otp }
            )}
          />
          {formik.touched.otp && formik.errors.otp && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.otp}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          id="kt_password_reset_submit"
          className="btn btn-primary me-4"
          disabled={loading || formik.isSubmitting}
        >
          {!loading && (
            <span className="indicator-label">
              {showOtpField ? "Reset Password" : "Send OTP"}
            </span>
          )}
          {loading && (
            <span className="indicator-progress">
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
        <Link to="/auth/login">
          <button
            type="button"
            id="kt_login_password_reset_form_cancel_button"
            className="btn btn-light"
            disabled={loading || formik.isSubmitting}
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}
