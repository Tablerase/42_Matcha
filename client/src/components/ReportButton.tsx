import { client } from "@/utils/axios";
import ReportIcon from "@mui/icons-material/Report";
import { Button } from "@mui/material";
import { useState } from "react";

export const ReportButton = ({ userId }: { userId: number }) => {
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    // Confirmation dialog can be added here
    const confirmed = window.confirm(
      "Are you sure you want to report this user?"
    );
    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      const response = await client.post(`/users/${userId}/reports`);
      if (response && response.status === 201) {
        console.log("User reported successfully:", response.data);
      } else {
        console.log(
          "Failed to report user. Status code:",
          response?.status,
          "Message:",
          response?.data?.message
        );
      }
    } catch (error) {
      console.error("Error reporting user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="warning"
      startIcon={<ReportIcon />}
      onClick={handleReport}
      size="small"
      sx={{ mt: 1 }}
    >
      {loading ? "Reporting..." : "Report Fake Account"}
    </Button>
  );
};
