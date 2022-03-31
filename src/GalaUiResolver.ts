import { kebabCase } from 'unplugin-vue-components'
import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from 'unplugin-vue-components'

export interface GalaUiResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * use commonjs lib & source css or scss for ssr
   */
  ssr?: boolean

  /**
   * specify gala-ui version to load style
   *
   * @default installed version
   */
  version?: string

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

type GalaUiResolverOptionsResolved = Required<
  Omit<GalaUiResolverOptions, 'exclude'>
> &
  Pick<GalaUiResolverOptions, 'exclude'>

function getSideEffects(
  dirName: string,
  options: GalaUiResolverOptionsResolved
): SideEffectsInfo | undefined {
  const { importStyle } = options
  const themeFolder = 'gala-ui/theme-chalk'

  if (importStyle === 'sass')
    return `${themeFolder}/src/${dirName}.scss`
  else if (importStyle === true || importStyle === 'css')
    return `${themeFolder}/el-${dirName}.css`
}

function resolveComponent(
  name: string,
  options: GalaUiResolverOptionsResolved
): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude)) return

  if (!name.match(/^Gl[A-Z]/)) return

  const partialName = kebabCase(name.slice(2)) // ElTableColumn -> table-column
  const { ssr } = options
  const esComponentsFolder = `gala-ui/${ssr ? 'lib' : 'es'}/`

  // return {
  //   importName: name,
  //   path: `gala-ui/${ssr ? 'lib' : 'es'}`,
  //   sideEffects: getSideEffects(partialName, options),
  // }
  return {
    importName: name,
    path: `${esComponentsFolder}/index`,
    sideEffects: getSideEffects(partialName, options),
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resolveDirective(
  name: string,
  options: GalaUiResolverOptionsResolved
): ComponentInfo | undefined {
  if (!options.directives) return

  const directives: Record<string, { importName: string; styleName: string }> =
    {
      Loading: { importName: 'GlLoadingDirective', styleName: 'loading' },
      Popover: { importName: 'GlPopoverDirective', styleName: 'popover' },
      InfiniteScroll: {
        importName: 'GlInfiniteScroll',
        styleName: 'infinite-scroll',
      },
    }

  const directive = directives[name]
  const directiveName = kebabCase(name)
  if (!directive || !directiveName) return

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { version, ssr } = options
  const esDirectiveFolder = `gala-ui/${ssr ? 'lib' : 'es'}/`

  // >=1.1.0-beta.1
  // if (cv.compare(version, '1.1.0-beta.1', '>=')) {
  return {
    importName: directive.importName,
    path: `${esDirectiveFolder}/index`,
    sideEffects: getSideEffects(directive.styleName, options),
  }
  // }
}

export function GalaUiResolver(
  options: GalaUiResolverOptions = {}
): ComponentResolver[] {
  let optionsResolved: GalaUiResolverOptionsResolved

  function resolveOptions() {
    if (optionsResolved) return optionsResolved
    optionsResolved = {
      ssr: false,
      version: '0.0.0-dev.1',
      importStyle: 'css',
      directives: true,
      exclude: undefined,
      ...options,
    }
    return optionsResolved
  }

  return [
    {
      type: 'component',
      resolve: (name: string) => {
        return resolveComponent(name, resolveOptions())
      },
    },
    {
      type: 'directive',
      resolve: (name: string) => {
        return resolveDirective(name, resolveOptions())
      },
    },
  ]
}
