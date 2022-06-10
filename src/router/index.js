import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    //用户列表
                    path: '/user',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/User.vue'),
                    meta: { title: '用户列表' }
                },
                {
                    //用户列表
                    path: '/role',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Role.vue'),
                    meta: { title: '角色列表' }
                },
                {
                    //菜单列表
                    path: '/menu',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Menu.vue'),
                    meta: { title: '菜单列表' }
                },
                {
                    //分配菜单
                    path: '/allocMenu',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/allocMenu.vue'),
                    meta: { title: '菜单分配' }
                },
                {
                    //品牌管理
                    path: '/brand',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Brand.vue'),
                    meta: { title: '品牌列表' }
                },
                {
                    //品牌新增/编辑
                    path: '/brandHandle',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/BrandHandle.vue'),
                    meta: { title: '品牌管理' }
                },
                {
                    //商品分类
                    path: '/category',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Category.vue'),
                    meta: { title: '分类列表' }
                },
                {
                    //商品属性
                    path: '/attribute',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Attribute.vue'),
                    meta: { title: '属性列表' }
                },
                {
                    //商品分类管理
                    path: '/categoryHandle',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/CategoryHandle.vue'),
                    meta: { title: '分类管理' }
                },
                {
                    //商品列表
                    path: '/goods',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Goods.vue'),
                    meta: { title: '商品列表' }
                },
                {
                    //添加商品
                    path: '/goodsHandle',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/GoodsHandle.vue'),
                    meta: { title: '商品管理' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
