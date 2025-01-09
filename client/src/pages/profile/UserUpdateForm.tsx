import { MultipleSelectChip } from '@/components/MultipleSelectChip';
import Form from '@rjsf/mui';
import { RJSFSchema, UiSchema, WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { Tag } from '@app/interfaces';
import { SelectChangeEvent } from '@mui/material';



export interface UserUpdateFormProps {
  tags?: Tag[],
  userTags: Tag[], 
  onTagsChange: (event: SelectChangeEvent<string[]>) => void
}

const schema: RJSFSchema = {
    title: "Personal Info",
    required: ["First name", "Last name", "Username", "Email", "Date of birth", "Gender", "Preferences"],
    properties: {
        "First name": { type: "string", "minLength": 3, "maxLength": 100 }, required: true,
        "Last name": { type: "string", "minLength": 3, "maxLength": 100 },
        "Username": { type: "string", "minLength": 3, "maxLength": 100 },
        Email: { type: "string", format: "email_address", maxLength: 255,},
        "Date of birth": { type: "string" },
        Gender: { 
            type: "string",
            enum: ["male", "female", "other"],
          },
        Preferences: { 
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
              enum: ["male", "female", "other"],
            }
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

  const customFormats = {
    email_address: /\S+@\S+\.\S+/,
  };


  

export const UserUpdateForm = ({tags, userTags, onTagsChange}: UserUpdateFormProps) => { 
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

  //add validation for username!!
//   move this to edit profile component not to have issue with passing props
  const onSubmit = ({ formData }: any) => console.log("submit: ", formData);
    return (
<Form
schema={schema} uiSchema={uiSchema} validator={validator} onSubmit={onSubmit}/>
    )
}

