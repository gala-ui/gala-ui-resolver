import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { GalaUiResolver } from '../../dist'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      // include: `${__dirname}/**`,
      // include: `C:\\Users\\u8868132\\projects\\galaui-web/**`,
      // include: path.resolve(__dirname, '../'),
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: GalaUiResolver({ importStyle: 'sass' }),
      dts: false,
    })
  ]
})
