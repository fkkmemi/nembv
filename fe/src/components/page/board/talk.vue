<template>
  <div>
    <b-row class="mb-4">
      <b-col cols="6">
        <input type="text" v-model="filter" class="form-control" id="input-text" placeholder="검색 제목">
      </b-col>
      <b-col cols="6">
        <b-form-group horizontal label="Per" class="mb-0">
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
          <!--<ul>-->
            <!--<li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>-->
          <!--</ul>-->
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
                      label-for="fid">
          <b-form-input id="fid"
                        type="text"
                        v-model="form.id"
                        required
                        placeholder="홍길동">
          </b-form-input>
        </b-form-group>

        <b-form-group label="제목:"
                      label-for="ftitle">
          <b-form-input id="ftitle"
                        type="text"
                        v-model="form.title"
                        required
                        placeholder="아무거나">
          </b-form-input>
        </b-form-group>

        <b-form-group label="글"
                      label-for="fcontent">
          <b-form-textarea id="fcontent"
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
                      label-for="fid">
          <b-form-input id="fid"
                        type="text"
                        v-model="form.id"
                        required
                        placeholder="홍길동">
          </b-form-input>
        </b-form-group>

        <b-form-group label="제목:"
                      label-for="ftitle">
          <b-form-input id="ftitle"
                        type="text"
                        v-model="form.title"
                        required
                        placeholder="아무거나">
          </b-form-input>
        </b-form-group>

        <b-form-group label="글"
                      label-for="fcontent">
          <b-form-textarea id="fcontent"
                           v-model="form.content"
                           placeholder="재미있는 글"
                           :rows="10"
                           :max-rows="20">
          </b-form-textarea>
        </b-form-group>

        <b-btn type="submit" variant="warning" class="float-right">글 수정</b-btn>
      </b-form>


      <!--<div slot="modal-footer">-->
        <!--<b-btn type="submit" class="float-right" variant="primary">저장</b-btn>-->
      <!--</div>-->
    </b-modal>
  </div>
</template>

<script>

  export default {
    name: 'talk',
    data() {
      return {
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
        this.$refs.mdMod.show();
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
        this.sortBy = ctx.sortBy;
        this.sortDesc = ctx.sortDesc;
        // if (ctx.sortDesc) this.s.order = -1;
        // else this.s.order = 1;
        this.list();
        // console.log(ctx);
      },
      list(ctx) {
        this.sortBy = ctx.sortBy;
        this.sortDesc = ctx.sortDesc;
        this.isBusy = true;
        const p = this.$axios.get(`${this.$cfg.path.api}data/board`, {
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
        this.$axios.get(`${this.$cfg.path.api}data/board/${_id}`)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            r.item.cntView = res.data.d.cntView;
            r.item.content = res.data.d.content;
            // console.log(res.data.d);
            // console.log(r.item);
            this.isBusy = false;
          })
          .catch((err) => {
            this.isBusy = false;
            this.swalError(err.message);
          });
      },
      add(evt) {
        evt.preventDefault();
        this.$axios.post(`${this.$cfg.path.api}data/board`, this.form)
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
            return this.$axios.put(`${this.$cfg.path.api}data/board`, this.form);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('글 수정 완료');
          })
          .then(() => {
            this.$refs.mdMod.hide();
            this.refresh();
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
            return this.$axios.delete(`${this.$cfg.path.api}data/board`, {
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
    },
    watch: {
      search() {
        // this.inputSync();
        // this.list();
      },
    },
  };
</script>

<style scoped>
</style>
