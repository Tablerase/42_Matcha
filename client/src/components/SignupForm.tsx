import Form from "@rjsf/mui";
import {
  getSubmitButtonOptions,
  RJSFSchema,
  SubmitButtonProps,
  UiSchema,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { customValidate, transformErrors } from "@/utils/formUtils";
import { IChangeEvent } from "@rjsf/core";
import { FormEvent } from "react";
import { UserSignup } from "@/app/interfaces";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import { useSignup } from "@/pages/auth/authActions";

const schema: RJSFSchema = {
  required: ["firstName", "lastName", "username", "email", "password"],
  properties: {
    firstName: {
      title: "First name",
      type: "string",
      minLength: 3,
      maxLength: 100,
    },
    lastName: {
      title: "Last name",
      type: "string",
      minLength: 3,
      maxLength: 100,
    },
    username: {
      title: "Username",
      type: "string",
      minLength: 3,
      maxLength: 100,
    },
    email: { title: "Email", type: "string", maxLength: 255 },
    password: {
      title: "Password",
      type: "string",
      minLength: 8,
      maxLength: 255,
    },
  },
};

const SignupButton = (props: SubmitButtonProps) => {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Button
        type="submit"
        variant="contained"
        sx={{
          minWidth: "120px",
        }}
      >
        Sign up
      </Button>
    </Box>
  );
};

export const SignupForm = () => {
  const signup = useSignup();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<UserSignup>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (data: IChangeEvent<any, RJSFSchema, any>) => {
    setIsSubmitted(true);
    setFormData((prev) => ({ ...prev, ...data.formData }));
  };

  const uiSchema: UiSchema = {
    email: {
      "ui:widget": "email",
      "ui:options": {
        inputType: "email",
      },
    },
    password: {
      "ui:widget": "password",
      "ui:options": {
        inputType: "password",
      },
    },
  };

  const onSubmit = (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: FormEvent<any>
  ) => {
    setIsSubmitted(true);
    signup(formData);
  };

  return (
    <Form
      onChange={handleChange}
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      formData={formData}
      onSubmit={onSubmit}
      transformErrors={transformErrors}
      customValidate={customValidate}
      templates={{
        ButtonTemplates: {
          SubmitButton: SignupButton,
        },
      }}
      liveValidate={isSubmitted}
      showErrorList={false}
      noHtml5Validate
    />
  );
};
