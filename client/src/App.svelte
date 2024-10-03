<script>
  import { wsx } from "@axel669/zephyr";
  import { LoadZone, Button, Screen, Paper, Flex, Titlebar, Text, Icon } from "@axel669/zephyr";

  const API = `${process.env.API_ROOT_URI}/api/v1`;

  const serverInfo = async () => {
    const res = await fetch(`${API}/server_info`);
    return await res.json();
  }
</script>

<svelte:body use:wsx={{ "@@theme": 'dark', "@@app": true, "p": "8px" }} />

<Screen>
  <Paper>
    <Titlebar slot="header">
      <Flex p="0px" gap="0px" slot="title">
        <Text title> Dosiero! </Text>
      </Flex>

      <Button ground m="2px" w="44px" color="@primary" slot="action">
        <Icon name="person-fill"></Icon>
      </Button>
    </Titlebar>

    <LoadZone source={serverInfo()} let:result>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </LoadZone>

    <Titlebar slot="footer">
      <Text slot="title" title>
        <Text subtitle>Exactly like GitHub Gists except not.</Text>
      </Text>
    </Titlebar>
  </Paper>
</Screen>