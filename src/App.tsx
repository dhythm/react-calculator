import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconCirclePlus, IconCircleMinus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

type Action = "add" | "subtract" | "multiply" | "divide";
const actions: Record<Action, string> = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/",
};

function App() {
  const form = useForm({
    initialValues: {
      text: "",
      items: [
        { key: randomId(), name: "", value: "", unit: "", action: "add" },
      ],
    },
  });

  const tokens = form.values.items.flatMap((item) =>
    item.value ? [actions[item.action], item.value] : []
  );
  const [data, setData] = useState({});
  const result = useMemo(() => calculateTokens(tokens), [tokens]);

  return (
    <Box style={{ padding: 16 }}>
      <form onSubmit={form.onSubmit((values) => setData(values))}>
        <TextInput
          label="text"
          sx={{ flexGrow: 1 }}
          {...form.getInputProps("text")}
        />
        {form.values.items.map((item, idx) => (
          <Group key={item.key} mt="xs">
            <TextInput
              label="name"
              sx={{ flexGrow: 1 }}
              {...form.getInputProps(`items.${idx}.name`)}
            />
            <TextInput
              label="value"
              sx={{ flexGrow: 1 }}
              {...form.getInputProps(`items.${idx}.value`)}
            />
            <TextInput
              label="unit"
              sx={{ flexGrow: 1 }}
              {...form.getInputProps(`items.${idx}.unit`)}
            />
            <Select
              label="action"
              data={Object.entries(actions).map(([value, label]) => ({
                value,
                label,
              }))}
              style={{ width: 80 }}
              disabled={idx === 0}
              {...form.getInputProps(`items.${idx}.action`)}
            />
            <ActionIcon size="lg" variant="hover">
              {form.values.items.length === idx + 1 ? (
                <IconCirclePlus
                  onClick={() =>
                    form.insertListItem("items", {
                      key: randomId(),
                      name: "",
                      value: "",
                      unit: "",
                      action: "add",
                    })
                  }
                />
              ) : (
                <IconCircleMinus
                  onClick={() => form.removeListItem("items", idx)}
                />
              )}
            </ActionIcon>
          </Group>
        ))}
        <Group position="left" mt="md">
          <Button type="submit">Calculate</Button>
        </Group>
      </form>
      <Box mt="md">
        {form.values.items
          .flatMap((item) =>
            item.value
              ? `${actions[item.action]} ${item.name} ${item.value} (${
                  item.unit
                })`
              : []
          )
          .join(" ")}
      </Box>
      <Box>= {result}</Box>
      <Box>{JSON.stringify(data)}</Box>
    </Box>
  );
}

const calculateTokens = ([, ...tokens]: string[]) => {
  const _tokens = [...tokens];
  while (_tokens.length > 0) {
    if (_tokens.length === 1) {
      return Number(_tokens[0]);
    }
    const higherOperatorIndex = _tokens.findIndex(
      (token) => token === "*" || token === "/"
    );
    if (higherOperatorIndex > 0) {
      const accumulator =
        _tokens[higherOperatorIndex] === "/"
          ? Number(_tokens[higherOperatorIndex - 1]) /
            Number(_tokens[higherOperatorIndex + 1])
          : Number(_tokens[higherOperatorIndex - 1]) *
            Number(_tokens[higherOperatorIndex + 1]);
      _tokens.splice(higherOperatorIndex - 1, 3, accumulator);
      continue;
    }
    const lowerOperatorIndex = _tokens.findIndex(
      (token) => token === "+" || token === "-"
    );
    console.log(lowerOperatorIndex);
    if (lowerOperatorIndex > 0) {
      const accumulator =
        _tokens[lowerOperatorIndex] === "-"
          ? Number(_tokens[lowerOperatorIndex - 1]) -
            Number(_tokens[lowerOperatorIndex + 1])
          : Number(_tokens[lowerOperatorIndex - 1]) +
            Number(_tokens[lowerOperatorIndex + 1]);
      _tokens.splice(lowerOperatorIndex - 1, 3, accumulator);
    }
  }
  return null;
};

export default App;
