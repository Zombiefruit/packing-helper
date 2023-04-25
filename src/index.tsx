import { useEffect, useState } from "react";
import { Packer } from "./packer";
import { Center, Button, Title, Flex, Text, Blockquote } from "@mantine/core";
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
      <Flex direction="column">
        <Center mb={50}>
          <Flex direction="column">
            <Title order={1} mb={10}>
              What's the point?
            </Title>
            <Text>
              A little app that lets you manage boxes as you move apartments.
              Share the unique URL with others, edit boxes and their contents
              together as you pack, and mark boxes in real life with their
              3-letter ID.
            </Text>
            <Blockquote cite="– Barack Obama">
              Moving has never been so over-engineered. Think of all the
              actually useful things that could have been built instead of this
              app.
            </Blockquote>
          </Flex>
        </Center>

        <Button
          style={{ width: 250 }}
          onClick={() => {
            window.open(window.location.href + uid(), "_blank");
          }}
        >
          Create a new packing list
        </Button>
      </Flex>
    </Center>
  );
};
