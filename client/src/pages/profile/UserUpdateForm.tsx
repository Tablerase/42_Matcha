import { MultipleSelectChip } from "@/components/MultipleSelectChip";
import Form from "@rjsf/mui";
import {
  RJSFSchema,
  UiSchema,
  FieldProps,
  ErrorTransformer,
  RJSFValidationError,
  SubmitButtonProps,
  getSubmitButtonOptions,
  RegistryWidgetsType,
  RegistryFieldsType,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Gender, Tag, User, UserUpdateFormProps } from "@/app/interfaces";
import { SelectChangeEvent } from "@mui/material";
import { isValidUsername, isValidEmail } from "@/utils/helpers";
import { SubmitButton } from "@/components/SubmitButton";
import {
  useUpdateUserProfile,
  useAddUserTags,
  useDeleteUserTags,
} from "@pages/browse/usersActions";
import { IChangeEvent } from "@rjsf/core";
import { FormEvent } from "react";
import { LocationButton } from "@/components/LocationButton";
import { FormData } from "@/app/interfaces";
import { useState } from "react";
import { FormDatePicker } from "@/components/FormDatePicker";

// TODO: add proper format for dateOfBirth
// TODO: add proper messages when required fields are not filled

const schema: RJSFSchema = {
  required: [
    "firstName",
    "lastName",
    "username",
    "email",
    "dateOfBirth",
    "gender",
    "preferences",
    "location",
  ],
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
    dateOfBirth: { title: "Date of birth", type: "string" },
    gender: {
      title: "Gender",
      type: "string",
      enum: [Gender.Male, Gender.Female, Gender.Other],
    },
    preferences: {
      title: "Preferences",
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
        enum: [Gender.Male, Gender.Female, Gender.Other],
      },
      minItems: 1,
    },
    bio: { title: "Bio", type: "string", maxLength: 500 },
    location: {
      title: "Location",
      type: "object",
      properties: {
        x: { type: "number" },
        y: { type: "number" },
      },
    },
    city: { title: "City", type: "string", maxLength: 150 },
    interests: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          tag: { type: "string" },
        },
      },
    },
  },
};

export const UserUpdateForm = ({
  user,
  tags,
  userTags,
  onDateChange,
  onTagsChange,
}: UserUpdateFormProps) => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    username: user?.username,
    email: user?.email,
    dateOfBirth: user?.dateOfBirth,
    gender: user?.gender,
    preferences: user?.preferences,
    bio: user?.bio || "",
    city: user?.city || "",
    interests: userTags,
    location: user?.location,
  });

  const handleChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const uiSchema: UiSchema = {
    email: {
      "ui:widget": "email",
      "ui:options": {
        inputType: "email",
      },
    },
    dateOfBirth: {
      "ui:widget": FormDatePicker,
      "ui:options": {
        dateOfBirth: user?.dateOfBirth || null,
        handleChange: onDateChange,
      },
    },
    gender: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true,
      },
    },
    preferences: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: true,
      },
    },
    bio: {
      "ui:widget": "textarea",
    },
    interests: {
      "ui:widget": MultipleSelectChip,
      "ui:options": {
        items: tags,
        userTags: userTags,
        handleChange: onTagsChange,
      },
    },
    location: {
      "ui:field": "location",
      "ui:options": {},
    },
  };
  const fields: RegistryFieldsType = {
    location: LocationButton,
  };

  const customValidate = (formData: any, errors: any) => {
    if (!isValidEmail(formData.email)) {
      errors.email.addError("Invalid email address");
    }
    if (!isValidUsername(formData.username)) {
      errors.username.addError(
        "Username can only contain letters, numbers, and underscores"
      );
    }
    return errors;
  };

  const transformErrors = (
    errors: RJSFValidationError[],
    uiSchema?: UiSchema<any, RJSFSchema, any>
  ): RJSFValidationError[] => {
    console.log("errors: ", errors);
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
  const { updateUserData } = useUpdateUserProfile();
  const updateUserTags = useAddUserTags();
  const deleteUserTags = useDeleteUserTags();

  const onSubmit = (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: FormEvent<any>
  ) => {
    console.log("Data submitted: ", data.formData);
    console.log(userTags);
    console.log(data.formData?.interests);
    for (const tag of data.formData?.interests) {
      if (userTags?.includes(tag)) continue;
      else if (!userTags?.includes(tag))
        updateUserTags({ userId: data.formData.id, tagId: tag.id });
    }
    // TODO: properly delete tags
    // if (userTags) {
    //   for (const tag of userTags) {
    //     if (!interests?.some((interest) => tag.id === interest.id)) {
    //       deleteUserTags({ userId: user.id, tagId: tag.id });
    //     }
    //   }
    // }

    if (data.formData) {
      updateUserData(data.formData);
    }
  };
  // const [formData, setFormData] = React.useState(formData);
  return (
    <Form
      // onChange={}
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      formData={formData}
      onSubmit={onSubmit}
      transformErrors={transformErrors}
      customValidate={customValidate}
      liveValidate
      showErrorList={false}
      templates={{ ButtonTemplates: { SubmitButton } }}
      fields={fields}
    />
  );
};
