import {
  RJSFSchema,
  UiSchema,
  RJSFValidationError,
  FormValidation,
} from "@rjsf/utils";
import { isValidUsername, isValidEmail } from "@/utils/helpers";

export const customValidate = (formData: any, errors: FormValidation) => {
  if (!isValidEmail(formData.email)) {
    errors.email?.addError("Invalid email address");
  }
  if (!isValidUsername(formData.username)) {
    errors.username?.addError(
      "Username can only contain letters, numbers, and underscores"
    );
  }
  return errors;
};

export const transformErrors = (
  errors: RJSFValidationError[],
  uiSchema?: UiSchema<any, RJSFSchema, any>
): RJSFValidationError[] => {
  return errors.map((error: any) => {
    if (error.name === "type" || error.name === "required") {
      error.message = "This field is required";
    }
    if (error.name === "minLength") {
      error.message = "Must be at least 3 characters long";
    }
    if (error.name === "maxLength" && error.params.limit === 100) {
      error.message = "Must be at most 100 characters long";
    }
    if (error.name === "maxLength" && error.params.limit === 255) {
      error.message = "Must be at most 255 characters long";
    }
    if (error.name === "maxLength" && error.params.limit === 500) {
      error.message = "Must be at most 500 characters long";
    }
    return error;
  });
};
