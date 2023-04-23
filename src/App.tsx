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
} from "@mantine/core";
import ShortUniqueId from "short-unique-id";
import { Box, ListSearch, Plus, Trash } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";

const uid = new ShortUniqueId({ length: 3 });

function App() {
  const {
    boxes,
    addBox,
    liveblocks: { enterRoom, leaveRoom },
  } = useBoxesStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    enterRoom("room-id");
    return () => {
      leaveRoom("room-id");
    };
  }, [enterRoom, leaveRoom]);

  const onAddBox = useCallback(() => {
    const box = {
      id: uid(),
      contents: [],
    };

    addBox(box);
  }, [addBox]);

  return (
    <Container size="xl" p={100}>
      <Flex justify="space-between">
        <Button onClick={onAddBox} mb={50} leftIcon={<Plus />}>
          Add Box
        </Button>
        <Container m={0}>
          <Input
            placeholder="Search"
            icon={<ListSearch />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Container>
      </Flex>
      <SimpleGrid cols={3}>
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
    </Container>
  );
}

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
              <Text weight={500}>{box.id}</Text>
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
              placeholder="Add something"
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

      <Modal opened={opened} onClose={close} title="Delete" centered>
        <Container>
          Are you sure you want to delete this box?
          <Button
            color="red"
            variant="filled"
            onClick={() => {
              removeBox(box);
              close();
            }}
          >
            Delete
          </Button>
        </Container>
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
      <Flex style={{ height: 25 }}>
        <Text size="s" mr={10}>
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

export default App;
