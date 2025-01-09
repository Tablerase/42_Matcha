import { getIpData } from "@/utils/helpers";
import { FieldProps } from "@rjsf/utils";
import { Button } from "@mui/material";

export const LocationButton = (props: FieldProps) => {
    const { onChange } = props;
    const handleLocationUpdate = async () => {
      try {
        const data = await getIpData();
        onChange({ x: data.latitude, y: data.longitude });
      } catch (e) {
        console.error(e);
      }
    };
    return (
      <Button variant="contained" onClick={() => handleLocationUpdate()}>
        Locate Me!
      </Button>
    );
  }