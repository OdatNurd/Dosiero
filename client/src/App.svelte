<script>
  import { wsx } from "@axel669/zephyr";
  import { LoadZone, Button, Screen, Paper, Flex, Titlebar, Text, Icon, Link } from "@axel669/zephyr";

  const API = `${process.env.API_ROOT_URI}/api/v1`;
  const LOGIN = `${process.env.API_ROOT_URI}/login`;
  const LOGOUT = `${process.env.API_ROOT_URI}/logout`;

  let serverInfo = {};
  const getServerInfo = async () => {
    const res = await fetch(`${API}/server_info`);
    serverInfo = await res.json();
    return serverInfo;
  }

  let userInfo = {};
  const getUserInfo = async () => {
    const res = await fetch(`${API}/user`, {"credentials": "include"});
    userInfo = await res.json();
    return userInfo;
  }

  const getDebugInfo = async () => {
    const data = {
      "server_info": await getServerInfo(),
      "user": await getUserInfo()
    }

    return data;
  }
</script>

<svelte:body use:wsx={{ "@@theme": 'dark', "@@app": true, "p": "8px" }} />

<Screen>
  <Paper>
    <Titlebar slot="header">
      <Flex p="0px" gap="0px" slot="title">
        <Text title> Dosiero! </Text>
      </Flex>

      <Link button ground m="2px" w="44px" color="@primary" href={userInfo.username ? LOGOUT : LOGIN} slot="action">
        <Icon name="person-fill"></Icon>
      </Link>
    </Titlebar>

    <LoadZone source={getDebugInfo()} let:result>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </LoadZone>

    <Titlebar slot="footer">
      <Text slot="title" title>
        <Text subtitle>Exactly like GitHub Gists except not.</Text>
      </Text>
    </Titlebar>
  </Paper>
</Screen>