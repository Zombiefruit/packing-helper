import { useCallback, useEffect, useState } from "react";
import { Box as BoxType, useBoxesStore } from "./main";
import {
  Box as BoxContainer,
  Button,
  Card,
  Container,
  Flex,
  Text,
  Group,
  SimpleGrid,
  List,
  Input,
  ActionIcon,
  Modal,
  Loader,
  Center,
} from "@mantine/core";
import ShortUniqueId from "short-unique-id";
import { Box, ListSearch, Plus, Trash } from "tabler-icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

const uid = new ShortUniqueId({ length: 3 });

export const Packer: React.FC<{ roomId: string }> = ({ roomId }) => {
  const {
    boxes,
    addBox,
    liveblocks: { enterRoom, leaveRoom, isStorageLoading },
  } = useBoxesStore();
  const matches = useMediaQuery("(min-width: 900px)");
  const [search, setSearch] = useState("");

  useEffect(() => {
    enterRoom(roomId);
    return () => {
      leaveRoom(roomId);
    };
  }, [enterRoom, leaveRoom, roomId]);

  const onAddBox = useCallback(() => {
    const box = {
      id: uid(),
      contents: [],
    };

    addBox(box);
  }, [addBox]);
  console.log("isStorageLoading:", isStorageLoading);

  return (
    <Center style={{ width: "100%" }} pt={100} px="10%" mb={100}>
      {isStorageLoading ? (
        <Loader />
      ) : (
        <Flex direction="column" style={{ width: "100%" }}>
          <Flex justify="space-between" gap={10}>
            <Button onClick={onAddBox} mb={50} leftIcon={<Plus />} size="md">
              Add a Box
            </Button>
            <Container p={0} m={0}>
              <Input
                placeholder="Search"
                size="md"
                icon={<ListSearch />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </Container>
          </Flex>
          <SimpleGrid cols={matches ? 3 : 1}>
            {boxes
              .filter(
                (box) =>
                  box.id.toLowerCase().includes(search.toLowerCase()) ||
                  box.contents.filter((c) => {
                    console.log("c:", c);

                    return c.toLowerCase().includes(search.toLowerCase());
                  }).length
              )
              .map((box) => {
                return <BoxComponent box={box} key={box.id} />;
              })}
          </SimpleGrid>
        </Flex>
      )}
    </Center>
  );
};

const BoxComponent: React.FC<{
  box: BoxType;
}> = ({ box }) => {
  const { updateBox, removeBox } = useBoxesStore();
  const [newItem, setNewItem] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const handleAddItem = useCallback(() => {
    if (newItem) {
      updateBox({
        ...box,
        contents: [...box.contents, newItem],
      });

      setNewItem("");
    }
  }, [box, newItem, updateBox]);

  const handleRemoveItem = useCallback(
    (item: string) => {
      updateBox({
        ...box,
        contents: box.contents.filter((c) => c !== item),
      });
    },
    [box, updateBox]
  );

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Flex
          direction="column"
          justify="space-between"
          style={{ height: "100%" }}
        >
          <BoxContainer>
            <Group position="apart" mt="md" mb="xs">
              <Flex gap={4}>
                <Text>Box id: </Text>
                <Text weight={500}>{box.id.toLocaleUpperCase()}</Text>
              </Flex>
              <ActionIcon variant="light" color="red" onClick={open}>
                <Trash size="1rem" />
              </ActionIcon>
            </Group>
            <Group position="apart" mt="md" mb="xs">
              <Flex direction="column" style={{ width: "100%" }}>
                <List>
                  {box.contents.map((c) => (
                    <ListItem
                      item={c}
                      onRemove={handleRemoveItem}
                      key={`${box.id}-${c}`}
                    />
                  ))}
                </List>
              </Flex>
            </Group>
          </BoxContainer>

          <Flex gap={5} align="center" mt={25}>
            <Input
              icon={<Box />}
              placeholder="Socks, dishes, etc."
              size="md"
              value={newItem}
              onChange={(e) => {
                setNewItem(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddItem();
                }
              }}
            />
            <ActionIcon variant="gradient" color="blue" onClick={handleAddItem}>
              <Plus size="1rem" />
            </ActionIcon>
          </Flex>
        </Flex>
      </Card>

      <Modal opened={opened} onClose={close} centered>
        <Flex direction="column" gap={50} align="center">
          <Text>Are you sure you want to delete this box?</Text>
          <Button
            color="red"
            variant="filled"
            style={{ width: 100 }}
            onClick={() => {
              removeBox(box);
              close();
            }}
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export const ListItem: React.FC<{
  item: string;
  onRemove: (item: string) => void;
}> = ({ item, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <List.Item
      onMouseOver={() => {
        setIsHovered(true);
      }}
      onMouseOut={() => {
        setIsHovered(false);
      }}
    >
      <Flex wrap="wrap">
        <Text size="s" mr={10} mb={6}>
          {item}
        </Text>
        {isHovered && (
          <ActionIcon variant="subtle" onClick={() => onRemove(item)}>
            <Trash size="1rem" />
          </ActionIcon>
        )}
      </Flex>
    </List.Item>
  );
};
