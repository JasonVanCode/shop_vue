// import request from '../utils/request';

// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

import http from "../utils/http";
//登录请求
export function Login(url,data){
    return http.post(url,data)
}

//首页数据
export function Index(url){
    return http.get(url)
}

//用户列表
export function UserList(url,params){
    return http.get(url,params)
}

//新增用户
export function UserAdd(url,data){
    return http.post(url,data)
}

//删除用户
export function UserDel(url,data){
    return http.post(url,data)
}

//是否启用账号
export function UserStatusChange(url,data){
    return http.post(url,data)
}

//用户添加角色
export function UserAddRole(url,data){
    return http.post(url,data)
}

//角色列表
export function RoleList(url,params){
    return http.get(url,params)
}

//角色列表 返回 id name
export function RoleListIdName(url){
    return http.get(url)
}

//添加角色
export function RoleAdd(url,data){
    return http.post(url,data)
}

//修改角色状态
export function RoleStatusChange(url,data){
    return http.post(url,data)
}

//删除角色
export function RoleDel(url,data){
    return http.post(url,data)
}
//获取角色信息
export function RoleInfo(url,params){
    return http.get(url,params)
}
//角色菜单分配
export function RoleAlloc(url,data){
    return http.post(url,data)
}


//菜单列表
export function MenuList(url,params){
    return http.get(url,params)
}
//顶级菜单 只返回id 和 name
export function MenuListIdName(url){
    return http.get(url)
}
//添加菜单
export function MenuAdd(url,data){
    return http.post(url,data)
}
//删除菜单
export function MenuDel(url,data){
    return http.post(url,data)
}
//菜单树形数据结构获取
export function MenuTreeLists(url){
    return http.get(url)
}


//------商品模块--------
//品牌列表
export function BrandList(url,params){
    return http.get(url,params)
}
export function BrandAdd(url,data){
    return http.post(url,data)
}
export function BrandListIdName(){
    return http.get("/goods/brand/listIdName")
}

export function BrandEdit(url,params){
    return http.get(url,params)
}

//分类列表
export function CategoryList(url,params){
    return http.get(url,params)
}

export function CategoryListIdName(url){
    return http.get(url)
}
export function CategoryAdd(url,data){
    return http.post(url,data)
}

export function CategoryDel(url,data){
    return http.post(url,data)
}
//获取分类以及子类的数据
export function CategoryWithCHildren(){
    return http.get("/goods/category/withChildren")
}


//分类对应的属性
export function AttributeList(url,params){
    return http.get(url,params)
}
export function AttributeAdd(url,data){
    return http.post(url,data)
}
export function AttributeDel(url,data){
    return http.post(url,data)
}

//商品列表
export function GoodsList(params){
    return http.get("/goods/index",params)
}
//更改商品状态
export function GoodsStatusChange(data){
    return http.post("/goods/changeStatus",data)
}

//------文件上传模块--------
export function UploadSinglePic(url,data){
    return http.post(url,data)
}