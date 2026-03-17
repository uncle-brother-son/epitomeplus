import {StructureResolver} from 'sanity/structure'
import {HomeIcon, DocumentsIcon, BlockContentIcon, UlistIcon, CogIcon, CodeBlockIcon, MenuIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'



export const myStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),
      orderableDocumentListDeskItem({
        type: 'workType',
        title: 'Projects',
        icon: DocumentsIcon,
        S,
        context
      }),
      S.listItem()
        .title('About')
        .icon(BlockContentIcon)
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.listItem()
        .title('Info')
        .icon(UlistIcon)
        .schemaType('infoPage')
        .child(S.documentTypeList('infoPage')
        ),

      S.divider(),

      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Settings Documents')
            .items([
              S.listItem()
                .title('Site Data')
                .icon(CodeBlockIcon)
                .child(
                  S.document()
                    .schemaType('setSitedata')
                    .documentId('setSitedata')
                ),
              S.listItem()
                .title('Category Metadata')
                .icon(CodeBlockIcon)
                .child(
                  S.document()
                    .schemaType('setCategoryMetadata')
                    .documentId('setCategoryMetadata')
                ),
              S.listItem()
                .title('Navigation')
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType('setNavigation')
                    .documentId('setNavigation')
                ),
              S.listItem()
                .title('Footer')
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType('setFooter')
                    .documentId('setFooter')
                ),
            ])
        )
    ])