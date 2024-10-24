<script>
  import { wsx } from "@axel669/zephyr";
  import { Avatar, LoadZone, Button, Screen, Paper, Flex, Titlebar, Text, Icon, Link } from "@axel669/zephyr";

  const API = `/api/v1`;
  const LOGIN = `/login`;
  const LOGOUT = `/logout`;

  let serverInfo = {};
  const getServerInfo = async () => {
    const res = await fetch(`${API}/server/version`);
    serverInfo = (await res.json()).data;
    return serverInfo;
  }

  let userInfo = {};
  let profileImage = '/images/avatar_default.png';
  const getUserInfo = async () => {
    const res = await fetch(`${API}/user/current`);
    userInfo = (await res.json()).data;
    if (userInfo.profileImage !== undefined && userInfo.profileImage !== '') {
      profileImage = userInfo.profileImage;
    }

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
        {#if serverInfo.commit !== undefined}
          <Text subtitle>
            {serverInfo.commit}
            {#if serverInfo.treeIsDirty}
              (with changes)
            {/if}
          </Text>
        {/if}
      </Flex>

      <Link button ground m="2px" p="4px" w="52px" color="@primary" href={userInfo.name ? LOGOUT : LOGIN} slot="action">
        <Avatar w="36px" image={profileImage} />
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