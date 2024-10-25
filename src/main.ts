import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件
import Lazyload from "vue3-lazyload";  //引入图片懒加载插件

import App from './App.vue'
import router from './router'

const app = createApp(App)

//注册插件
app.use(Lazyload, {
    loading: "http://127.0.0.1:8080/imgs/loading.gif",  //指定加载中的图像
    error: "http://127.0.0.1:8080/imgs/err.png",  //指定加载失败的图像
 });

// 添加所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 设置中文
app.use(ElementPlus, {
    locale: zhCn
})
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
