import { useEffect, useState } from "react";
import { Packer } from "./packer";
import { Center, Button } from "@mantine/core";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 4 });

export const App = () => {
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const roomId = window.location.pathname.split("/")[1];

    if (roomId.length === 4) {
      setRoomId(roomId);
    }
  }, []);

  return roomId ? (
    <Packer roomId={roomId} />
  ) : (
    <Center p={100}>
      <Button
        onClick={() => {
          window.open(window.location.href + uid(), "_blank");
        }}
      >
        Create a new packing list
      </Button>
    </Center>
  );
};
