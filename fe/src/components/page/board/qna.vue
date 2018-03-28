<template>
  <div>
    <b-row class="mb-4">
      <b-col cols="6">
        <input type="text" v-model="filter" class="form-control" id="input-text" placeholder="검색 제목">
      </b-col>
      <b-col cols="6">
        <b-form-group>
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>

    <b-table
      id="tt"
      ref="table"
      show-empty
      stacked="md"
      :items="list"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :busy.sync="isBusy"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :filter="filter"
      no-local-sorting
    >
      <!--@sort-changed="sortingChanged"-->
      <!--:no-local-sorting="true"-->
      <template slot="_id" slot-scope="row">
        <b-badge variant="info">
          <!--{{ row.item._id }}-->
          {{ id2time(row.item._id) }}
        </b-badge>
      </template>
      <template slot="ut" slot-scope="row">
        <b-badge variant="info">
          {{ ago(row.item.ut) }}
        </b-badge>
      </template>
      <template slot="cmt_ids" slot-scope="row">
        <b-badge pill variant="success">
          {{ row.item.cmt_ids.length }}
        </b-badge>
      </template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" variant="primary" @click.stop="row.toggleDetails" @click="read(row)">
          {{ row.detailsShowing ? '숨기기' : '보기' }}
        </b-button>
        <!--<b-btn>{{row.item._id}}</b-btn>-->
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card no-body
                :title="row.item.title"
        >
          <b-card-body>
            <p class="card-text" style="white-space: pre;">{{row.item.content}}</p>
          </b-card-body>

          <b-list-group flush>
            <b-list-group-item v-for="(cmt, ci) in row.item.cmt_ids" :key="cmt._id">
              <b-row>
                <b-col cols="2">
                  <b-badge>{{ cmt.id }}</b-badge>
                </b-col>
                <b-col cols="6">
                  <span style="white-space: pre;">  {{ cmt.content}}</span>
                </b-col>
                <b-col cols="2">
                  <small class="text-muted"> {{ cmt.ip }} | {{ ago(cmt.ut) }}</small>
                </b-col>
                <b-col cols="2">
                  <b-button-group class="float-right" size="sm">
                    <b-btn variant="outline-warning" @click="mdModCmtOpen(row.item, cmt)"><icon name="pencil"></icon></b-btn>
                    <b-btn variant="outline-danger" @click="delCmt(row.item, cmt, ci)"><icon name="trash"></icon></b-btn>
                  </b-button-group>
                </b-col>
              </b-row>


            </b-list-group-item>
            <b-list-group-item>
              <span> 새 댓글 작성 </span>
              <b-button-group class="float-right" size="sm">
                <b-btn variant="outline-success" @click="mdAddCmtOpen(row.item)"><icon name="plus"></icon></b-btn>
              </b-button-group>
            </b-list-group-item>

          </b-list-group>

          <b-card-footer>
            <small class="text-muted">{{ ago(row.item.ut) }}</small>
            <b-button-group class="float-right">
              <b-btn variant="outline-warning" @click="mdModOpen(row.item)"><icon name="pencil"></icon></b-btn>
              <b-btn variant="outline-danger" @click="del(row.item)"><icon name="trash"></icon></b-btn>
            </b-button-group>
          </b-card-footer>
        </b-card>
      </template>
    </b-table>
    <!--<b-table id="my-table" show-empty :busy.sync="isBusy" :items="list"></b-table>-->


    <b-row>
      <b-col>
        <b-btn variant="info" @click="refresh">새로고침</b-btn>
        <b-btn variant="success" @click="mdAddOpen" >글쓰기</b-btn>
      </b-col>
      <b-col>
        <b-pagination
          align="right"
          size="md"
          :total-rows="totalRows"
          v-model="currentPage"
          :per-page="perPage"
        >
        </b-pagination>
      </b-col>
    </b-row>

    <b-modal ref="mdAdd" hide-footer title="새로운 글 작성">
      <b-form @submit="add">
        <b-form-group label="이름:"
                      label-for="f-a-id">
          <b-form-input id="f-a-id"
                        type="text"
                        v-model="form.id"
                        required
                        placeholder="홍길동">
          </b-form-input>
        </b-form-group>

        <b-form-group label="제목:"
                      label-for="f-a-title">
          <b-form-input id="f-a-title"
                        type="text"
                        v-model="form.title"
                        required
                        placeholder="아무거나">
          </b-form-input>
        </b-form-group>

        <b-form-group label="글"
                      label-for="f-a-content">
          <b-form-textarea id="f-a-content"
                           v-model="form.content"
                           placeholder="재미있는 글"
                           :rows="10"
                           :max-rows="20">
          </b-form-textarea>
        </b-form-group>

        <b-btn type="submit" variant="primary" class="float-right">글 쓰기</b-btn>
      </b-form>
    </b-modal>

    <b-modal ref="mdMod" hide-footer title="글 수정하기">
      <b-form @submit="mod">
        <b-form-group label="이름:"
                      label-for="f-m-id">
          <b-form-input id="f-m-id"
                        type="text"
                        v-model="form.id"
                        required
                        placeholder="홍길동">
          </b-form-input>
        </b-form-group>

        <b-form-group label="제목:"
                      label-for="f-m-title">
          <b-form-input id="f-m-title"
                        type="text"
                        v-model="form.title"
                        required
                        placeholder="아무거나">
          </b-form-input>
        </b-form-group>

        <b-form-group label="글"
                      label-for="f-m-content">
          <b-form-textarea id="f-m-content"
                           v-model="form.content"
                           placeholder="재미있는 글"
                           :rows="10"
                           :max-rows="20">
          </b-form-textarea>
        </b-form-group>

        <b-btn type="submit" variant="warning" class="float-right">글 수정</b-btn>
      </b-form>
    </b-modal>

    <b-modal ref="mdAddCmt" hide-footer title="댓글 작성">
      <b-form @submit="addCmt">
        <b-form-group label="이름:"
                      label-for="f-a-c-id">
          <b-form-input id="f-a-c-id"
                        type="text"
                        v-model="formCmt.id"
                        required
                        placeholder="홍길동">
          </b-form-input>
        </b-form-group>

        <b-form-group label="글"
                      label-for="f-a-c-content">
          <b-form-textarea id="f-a-c-content"
                           v-model="formCmt.content"
                           placeholder="재미있는 글"
                           :rows="10"
                           :max-rows="20">
          </b-form-textarea>
        </b-form-group>

        <b-btn type="submit" variant="primary" class="float-right">글 쓰기</b-btn>
      </b-form>
    </b-modal>

    <b-modal ref="mdModCmt" hide-footer title="댓글 수정하기">
      <b-form @submit="modCmt">
        <b-form-group label="이름"
                      label-for="f-m-c-id">
          <b-form-input id="f-m-c-id"
                        type="text"
                        v-model="formCmt.id"
                        required
                        placeholder="홍길동">
          </b-form-input>
        </b-form-group>

        <b-form-group label="글"
                      label-for="f-m-c-content">
          <b-form-textarea id="f-m-c-content"
                           v-model="formCmt.content"
                           placeholder="재미있는 글"
                           :rows="10"
                           :max-rows="20">
          </b-form-textarea>
        </b-form-group>

        <b-btn type="submit" variant="warning" class="float-right">글 수정</b-btn>
      </b-form>
    </b-modal>

  </div>
</template>

<script>

  export default {
    name: 'qna',
    data() {
      return {
        path: 'data/board/qna',
        fields: [
          {
            key: '_id',
            label: '등록일',
            sortable: true,
          },
          // {
          //   key: 'ut',
          //   label: '수정날짜',
          //   sortable: true,
          // },
          {
            key: 'id',
            label: '작성자',
            sortable: true,
          },
          {
            key: 'title',
            label: '제목',
            sortable: true,
          },
          {
            key: 'cntView',
            label: '조회',
            sortable: true,
          },
          {
            key: 'cmt_ids',
            label: '댓글',
            sortable: true,
          },
          {
            key: 'actions',
            label: '내용',
            sortable: true,
          },
        ],
        isBusy: false,
        items: [],
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'ut',
        sortDesc: false,
        filter: '',
        draw: 0,
        form: {
          _id: '',
          id: '',
          title: '',
          content: '',
        },
        formCmt: {
          bd_id: '',
          _id: '',
          id: '',
          content: '',
        },
        row: {},
        rowCmt: {},
      };
    },
    // props: ['items'],
    mounted() {
      // this.list();
      // this.test();
    },
    computed: {
      setSkip() {
        if (this.currentPage <= 0) return 0;
        return (this.currentPage - 1) * this.perPage;
      },
      setSort() {
        return this.sortDesc ? -1 : 1;
      },
    },
    methods: {
      swalSuccess(msg) {
        return this.$swal({
          icon: 'success',
          title: '성공',
          text: msg,
          timer: 2000,
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
      mdAddOpen() {
        this.form._id = '';
        this.form.id = '';
        this.form.title = '';
        this.form.content = '';
        this.$refs.mdAdd.show();
      },
      mdModOpen(v) {
        this.form._id = v._id;
        this.form.id = v.id;
        this.form.title = v.title;
        this.form.content = v.content;
        this.row = v;
        this.$refs.mdMod.show();
      },
      mdAddCmtOpen(r) {
        this.formCmt.bd_id = r._id;
        this.formCmt._id = '';
        this.formCmt.id = '';
        this.formCmt.content = '';
        this.row = r;
        this.$refs.mdAddCmt.show();
      },
      mdModCmtOpen(r, v) {
        this.formCmt.bd_id = r._id;
        this.formCmt._id = v._id;
        this.formCmt.id = v.id;
        this.formCmt.content = v.content;
        this.row = r;
        this.rowCmt = v;
        // this.formCmt = v;
        this.$refs.mdModCmt.show();
      },
      ago(t) {
        return this.$moment(t).fromNow();
      },
      id2time(_id) {
        return new Date(parseInt(_id.substring(0, 8), 16) * 1000).toLocaleString();
      },
      refresh() {
        this.$refs.table.refresh();
      },
      sortingChanged(ctx) {
        // todo: comment sort
      },
      list(ctx) {
        this.sortBy = ctx.sortBy;
        this.sortDesc = ctx.sortDesc;
        this.isBusy = true;
        const p = this.$axios.get(`${this.$cfg.path.api}${this.path}`, {
          params: {
            draw: (this.draw += 1),
            search: this.filter,
            skip: this.setSkip,
            limit: this.perPage,
            order: this.sortBy,
            sort: this.setSort,
          },
        });
        return p.then((res) => {
          if (!res.data.success) throw new Error(res.data.msg);
          this.totalRows = res.data.d.cnt;
          this.isBusy = false;
          // const items = res.data.d.ds;
          return res.data.d.ds;
        })
          .catch((err) => {
            this.isBusy = false;
            this.swalError(err.message);
            return [];
          });
      },
      read(r) {
        if (r.detailsShowing) return;
        const _id = r.item._id;
        this.isBusy = true;
        this.$axios.get(`${this.$cfg.path.api}${this.path}/${_id}`)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            r.item.cntView = res.data.d.cntView;
            r.item.content = res.data.d.content;
            r.item.cmt_ids = res.data.d.cmt_ids;
            this.isBusy = false;
          })
          .catch((err) => {
            this.isBusy = false;
            this.swalError(err.message);
          });
      },
      add(evt) {
        evt.preventDefault();
        this.$axios.post(`${this.$cfg.path.api}${this.path}`, this.form)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('글 작성 완료');
          })
          .then(() => {
            this.$refs.mdAdd.hide();
            this.refresh();
          })
          .catch((err) => {
            this.swalError(err.message);
          });
      },
      mod() {
        this.$swal({
          title: '작성한 글을 수정하시겠습니까?',
          dangerMode: true,
          buttons: {
            cancel: {
              text: '취소',
              visible: true,
            },
            confirm: {
              text: '수정',
            },
          },
        })
          .then((sv) => {
            if (!sv) throw new Error('');
            return this.$axios.put(`${this.$cfg.path.api}${this.path}`, this.form);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('글 수정 완료');
          })
          .then(() => {
            this.$refs.mdMod.hide();
            this.row.id = this.form.id;
            this.row.title = this.form.title;
            this.row.content = this.form.content;
            // this.refresh();
            // this.list(); // todo: instead one article..
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('글 수정 취소');
          });
      },
      del(v) {
        this.$swal({
          title: '글 삭제',
          dangerMode: true,
          buttons: {
            cancel: {
              text: '취소',
              visible: true,
            },
            confirm: {
              text: '삭제',
            },
          },
        })
          .then((sv) => {
            if (!sv) throw new Error('');
            return this.$axios.delete(`${this.$cfg.path.api}${this.path}`, {
              params: { _id: v._id },
            });
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('글 삭제 완료');
          })
          .then(() => {
            this.refresh();
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('글 삭제 취소');
          });
      },
      addCmt(evt) {
        evt.preventDefault();
        this.$axios.post(`${this.$cfg.path.api}${this.path}/comment`, this.formCmt)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            this.row.cmt_ids.push(res.data.d);
            return this.swalSuccess('댓글 추가 완료');
          })
          .then(() => {
            this.$refs.mdAddCmt.hide();
          })
          .catch((err) => {
            this.swalError(err.message);
          });
      },
      modCmt() {
        this.$swal({
          title: '댓글 수정 변경',
          dangerMode: true,
          buttons: {
            cancel: {
              text: '취소',
              visible: true,
            },
            confirm: {
              text: '수정',
            },
          },
        })
          .then((res) => {
            if (!res) throw new Error('');
            return this.$axios.put(`${this.$cfg.path.api}${this.path}/comment`, this.formCmt);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('댓글 수정 완료');
          })
          .then(() => {
            this.$refs.mdModCmt.hide();
            this.rowCmt.id = this.formCmt.id;
            this.rowCmt.content = this.formCmt.content;
            this.rowCmt.ut = new Date();
            // this.refresh();
          })
          .catch((err) => {
            if (err.message) this.swalError(err.message);
            else this.swalWarning('댓글 수정 취소');
          });
      },
      delCmt(r, cmt, i) {
        this.$swal({
          title: '댓글 삭제',
          dangerMode: true,
          buttons: {
            cancel: {
              text: '취소',
              visible: true,
            },
            confirm: {
              text: '삭제',
            },
          },
        })
          .then((res) => {
            if (!res) throw new Error('');
            return this.$axios.delete(`${this.$cfg.path.api}${this.path}/comment`, {
              params: { _id: cmt._id },
            });
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('댓글 삭제 완료');
          })
          .then(() => {
            r.cmt_ids.splice(i, 1);
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('댓글 삭제 취소');
          });
      },
    },
  };
</script>

<style scoped>
</style>
