import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "DASHBOARD.BASLIK",
    icon: "ri-dashboard-2-line",
    subItems: [
     {
      id:14,
      label:'DASHBOARD.BASLIK',
      link:'',
      parentId:1
     }
    ]
  },
  {
    id: 2,
    label: "TANIMLAR.BASLIK",
    icon: "ri-todo-line",
    subItems: [
      {
        id: 3,
        label: 'TANIMLAR.YAZAR_TANIM.BASLIK',
        link: '/tanimlar/yazar-tanim',
        parentId: 2,
      },
      {
        id: 4,
        label: 'TANIMLAR.KATEGORI_TANIM.BASLIK',
        link: '/tanimlar/kategori-tanim',
        parentId: 2,
      },
      {
        id: 5,
        label: 'TANIMLAR.CEVIRMEN_TANIM.BASLIK',
        link: '/tanimlar/cevirmen-tanim',
        parentId: 2,
      },
      {
        id: 6,
        label: 'TANIMLAR.DIL_TANIM.BASLIK',
        link: '/tanimlar/dil-tanim',
        parentId: 2,
      },
      {
        id: 7,
        label: 'TANIMLAR.YAYINEVI_TANIM.BASLIK',
        link: '/tanimlar/yayinevi-tanim',
        parentId: 2,
      },
      {
        id: 8,
        label: 'TANIMLAR.KONUM_TANIM.BASLIK',
        link: '/tanimlar/konum-tanim',
        parentId: 2,
      },
      {
        id: 9,
        label: 'TANIMLAR.KITAP_TANIM.BASLIK',
        link: '/tanimlar/kitap-tanim',
        parentId: 2,
      },
    ]
  },
  {
    id:10,
    label:'ODUNC_ISLEMLERI.BASLIK',
    icon:'ri-hand-heart-line',
    subItems: [
      {
        id:11,
        label:'ODUNC_ISLEMLERI.ODUNC_VER',
        link: "odunc-islemleri/odunc-kitap-ver",
        parentId:10,
      },
      {
        id:12,
        label:'ODUNC_ISLEMLERI.ODUNC_AL',
        link:'odunc-islemleri/odunc-kitap-al',
        parentId:10,
      },
    ]

  },
  {
    id:16,
    label:'RAPORLAR.BASLIK',
    icon:' ri-line-chart-line',
    subItems:[
      {
        id:17,
        label:"RAPORLAR.GECIKMIS_KITAPLAR.BASLIK",
        link:'raporlar/gecikmis-kitaplar',
        parentId:16
      },
      {
        id:18,
        label:"RAPORLAR.UYE_KITAP_GECMISI.BASLIK",
        link:'raporlar/uye-kitap-gecmisi',
        parentId:16
      }
    ]
  },
  // {
  //   id:13,
  //   label:'UYE_ISLEMLERI.BASLIK',
  //   icon:' ri-user-line',
  //   subItems:[
      
  //   ]
  // },
  {
    id:19,
    label:'AYARLAR.BASLIK',
    icon:'ri-settings-2-line',
    subItems:[
      {
        id:20,
        label:'AYARLAR.BASLIK',
        link:'ayarlar',
        parentId:19
      }
    ]
  },
];
