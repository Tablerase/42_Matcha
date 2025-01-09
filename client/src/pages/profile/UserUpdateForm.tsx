import { MultipleSelectChip } from '@/components/MultipleSelectChip';
import Form from '@rjsf/mui';
import { RJSFSchema, UiSchema, WidgetProps, ErrorTransformer, RJSFValidationError, SubmitButtonProps, getSubmitButtonOptions } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { Gender, Tag, User } from '@/app/interfaces';
import { SelectChangeEvent } from '@mui/material';
import { isValidUsername, isValidEmail } from '@/utils/helpers';
import { Button } from '@mui/material';
import { useUpdateUserProfile } from "@pages/browse/usersActions";
import { IChangeEvent } from '@rjsf/core';
import { FormEvent } from 'react';

export interface UserUpdateFormProps {
  user?: Partial<User>,
  tags?: Tag[],
  userTags: Tag[], 
  onTagsChange: (event: SelectChangeEvent<string[]>) => void
}

const schema: RJSFSchema = {
    required: ["First name", "Last name", "Username", "Email", "Date of birth", "Gender", "Preferences"],
    properties: {
        "First name": { type: "string", "minLength": 3, "maxLength": 100 },
        "Last name": { type: "string", "minLength": 3, "maxLength": 100 },
        "Username": { type: "string", "minLength": 3, "maxLength": 100 },
        Email: { type: "string", maxLength: 255,},
        "Date of birth": { type: "string" },
        Gender: { 
            type: "string",
            enum: [Gender.Male, Gender.Female, Gender.Other],
          },
        Preferences: { 
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
              enum: [Gender.Male, Gender.Female, Gender.Other],
            }, 
            minItems: 1,
          },
        Bio: { type: "string", maxLength: 500 },
        City: { type: "string", maxLength: 150 },
        Interests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                tag: { type: "string" }
              }
            }
          },
    },
  };

  function SubmitButton(props: SubmitButtonProps) {
    const { uiSchema } = props;
    const { norender } = getSubmitButtonOptions(uiSchema);
    if (norender) {
      return null;
    }
    return (
      <Button
          type="submit"
          variant="contained"
        >
          Save Changes
        </Button>
    );
  }

export const UserUpdateForm = ({user, tags, userTags, onTagsChange}: UserUpdateFormProps) => { 
  const uiSchema: UiSchema = {
    Email: {
        "ui:widget": "email",
        "ui:options": {
          inputType: "email",
        },
    },
    "Date of birth": {
        "ui:widget": "date"
    },
    Gender: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true
      }
    },
    Preferences: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true
        }
      },
    Bio: {
        "ui:widget": "textarea"
      },
    Interests: {
        "ui:widget": MultipleSelectChip,
        "ui:options": {
          items: tags,
          userTags: userTags,
          handleChange: onTagsChange
      }
      },
  };
  const formData = {
    userId: user?.id,
    "First name": user?.firstName,
    "Last name": user?.lastName,
    "Username": user?.username,
    Email: user?.email,
    "Date of birth": user?.dateOfBirth,
    Gender: user?.gender,
    Preferences: user?.preferences,
    Bio: user?.bio || "",
    City: user?.city,
    Interests: userTags
  }

  const customValidate = (formData: any, errors: any) => {
    console.log("formData: ", formData);
  if (!isValidEmail(formData.Email)) {
    errors.Email.addError("Invalid email address");
  }
  if (!isValidUsername(formData.Username)) {
    errors.Username.addError("Username can only contain letters, numbers, and underscores");
  }
  return errors;
}

const transformErrors = (
  errors: RJSFValidationError[], 
  uiSchema?: UiSchema<any, RJSFSchema, any>
): RJSFValidationError[] => {
  console.log("errors: ", errors);
  return errors.map((error: any) => {
    if (error.name === "type") {
      error.message = "This field is required";
    }
    if (error.name === 'minLength') {
      error.message = 'Must be at least 3 characters long';
    }
    if (error.name === 'maxLength' && error.params.limit === 100) {
      error.message = 'Must be at most 100 characters long';
    }
    if (error.name === 'maxLength' && error.params.limit === 255) {
      error.message = 'Must be at most 255 characters long';
    }
    if (error.name === 'maxLength' && error.params.limit === 500) {
      error.message = 'Must be at most 500 characters long';
    }
    return error;
  });
}
const { updateUserData } = useUpdateUserProfile();

  // const onSubmit = ({ formData }: any) => {
  //   console.log("formData: ", formData);
  //   updateUserData(formData)
  // };
  
  const onSubmit = (data: IChangeEvent<any, RJSFSchema, any>, event: FormEvent<any>) => {
    console.log('Data submitted: ', data.formData);
    if (data.formData) {
      updateUserData(data.formData);
    }
  };
  return (
    <Form
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
/>
  )

}

