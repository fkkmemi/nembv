<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="secondary">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#/">
        nembv prj
        <!--<img src="../../assets/logo.png" alt="logo" width="100"/>-->
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item-dropdown text="환경설정">
            <topItem link="company" icon="sss">
              회사 관리
            </topItem>
            <topItem link="group" icon="sss">
              그룹 관리
            </topItem>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="게시판">
            <topItem link="talk" icon="sss">
              잡담
            </topItem>
            <topItem link="qna" icon="sss">
              Q&A
            </topItem>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="테스트">
            <topItem link="test" icon="sss">
              test
            </topItem>
            <topItem link="hello" icon="sss">
              hello-vue
            </topItem>
          </b-nav-item-dropdown>
          <b-nav-item href="#" disabled>추후예정</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <!--<b-nav-form>-->
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <!--<b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>-->
          <!--</b-nav-form>-->

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">한국어</b-dropdown-item>
            <b-dropdown-item href="#">English</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <b-breadcrumb :items="this.$route.meta.breadcrumb"/>
  </div>
</template>

<script>
  import topItem from './topItem';

  export default {
    name: 'top',
    components: { topItem },
  };
</script>

<style scoped>

</style>
