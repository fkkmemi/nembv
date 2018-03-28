<template>
  <b-container class="p-3">
    <b-card header="로그인">
      <b-form @submit="signin">
        <b-form-group label="아이디"
                      label-for="f-id"
                      description="사이트 이용을 위해 필요합니다.">
          <b-form-input id="f-id"
                        type="text"
                        v-model="form.id"
                        required
                        placeholder="입력...">
          </b-form-input>
        </b-form-group>
        <b-form-group label="비밀번호"
                      label-for="f-pwd">
          <b-form-input id="f-pwd"
                        type="password"
                        v-model="form.pwd"
                        required
                        placeholder="비밀번호를 입력하세요">
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">로그인</b-button>
        <b-button variant="primary" href="/#/register">회원가입</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'sign',
  data() {
    return {
      path: 'auth/sign/in',
      form: {
        id: '',
        pwd: '',
      },
    };
  },
  methods: {
    swalSuccess(msg) {
      return this.$swal({
        icon: 'success',
        title: '성공',
        text: msg,
        // timer: 2000,
      });
    },
    swalWarning(msg) {
      return this.$swal({
        icon: 'warning',
        title: '실패',
        text: msg,
        timer: 2000,
      });
    },
    swalError(msg) {
      return this.$swal({
        icon: 'error',
        title: '에러',
        text: msg,
        timer: 2000,
      });
    },
    signin(evt) {
      evt.preventDefault();
      this.$axios.post(`${this.$cfg.path.api}${this.path}`, this.form)
        .then((res) => {
          if (!res.data.success) throw new Error(res.data.msg);
          return this.swalSuccess(`token: ${res.data.token}`);
        })
        .then(() => {
          location.href = '/#/';
        })
        .catch((err) => {
          this.swalError(err.message);
        });
    },
  },
};
</script>

