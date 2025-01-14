import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface FormDatePickerProps {
  onChange: (value: string) => void;
  value: string | undefined;
}

export const FormDatePicker = ({ onChange, value }: FormDatePickerProps) => {
  const handleDateChange = (value: Dayjs | null) => {
    if (!value) {
      return;
    }
    onChange(dayjs(value).hour(12).minute(0).second(0).millisecond(0).format());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date of birth"
        value={value ? dayjs(value) : null}
        onChange={handleDateChange}
        minDate={dayjs().subtract(90, "year")}
        maxDate={dayjs().subtract(18, "year")}
        format="DD/MM/YYYY"
        openTo="year"
        views={["year", "month", "day"]}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};
