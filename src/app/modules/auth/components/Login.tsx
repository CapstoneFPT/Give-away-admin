import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import { useAuth } from "../core/Auth";
import { AccountApi, AuthApi } from "../../../../api";
import { CurrentUserModel } from "../core/_models.ts";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
});

const initialValues = {
  email: "admin@gmail.com",
  password: "admin1",
};

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false);
  const { saveAuth, setCurrentUser } = useAuth();
  const [error, setError] = useState<string | undefined>(undefined);
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setError(undefined); // Clear previous errors
      try {
        const authApi = new AuthApi();
        const accountApi = new AccountApi();

        const { data } = await authApi.apiAuthLoginPost({
          email: values.email,
          password: values.password,
        });

        const tokenReponse = await accountApi.apiAccountsGetCurrentAccountPost({
          headers: {
            Authorization: `Bearer ${data.data!.accessToken!}`,
          },
        });

        if (
          tokenReponse.data?.data?.role !== "Admin" &&
          tokenReponse.data?.data!.role !== "Staff"
        ) {
          setError("Unauthorized access");
          setSubmitting(false);
          setLoading(false);
          return;
        }

        saveAuth({ api_token: data.data!.accessToken! });
        console.log(data.data!.role);

        const currentUser: CurrentUserModel = {
          role: data.data!.role!,
          email: data.data!.email!,
          shopId: tokenReponse.data.data!.shopId!,
          id: tokenReponse.data.data!.accountId!,
        };

        setCurrentUser(currentUser);
      } catch (error) {
        console.error(error);
        saveAuth(undefined);
        setError("The login details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
        <div className="text-gray-500 fw-semibold fs-6">Give Away Shop</div>
      </div>
      {/* begin::Heading */}
      {error && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{error}</div>
        </div>
      )}
      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">Email</label>
        <input
          placeholder="Email"
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.email && formik.errors.email },
            {
              "is-valid": formik.touched.email && !formik.errors.email,
            }
          )}
          type="email"
          name="email"
          autoComplete="off"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Password
        </label>
        <input
          type="password"
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.password && formik.errors.password,
            },
            {
              "is-valid": formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}

      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Continue</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  );
}
