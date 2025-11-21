declare module '@/components/layouts' {
  import { DefineComponent } from 'vue'

  export const AdminLayout: DefineComponent<{}, {}, any>
  export const AdminHeader: DefineComponent<{}, {}, any>
  export const AdminSidebar: DefineComponent<{}, {}, any>

  export const MemberLayout: DefineComponent<{}, {}, any>
  export const MemberHeader: DefineComponent<{}, {}, any>
  export const MemberSidebar: DefineComponent<{}, {}, any>

  export const StaffLayout: DefineComponent<{}, {}, any>
  export const StaffHeader: DefineComponent<{}, {}, any>
  export const StaffSidebar: DefineComponent<{}, {}, any>
}

declare module '@/components/layouts/admin-layout' {
  import { DefineComponent } from 'vue'

  export const AdminLayout: DefineComponent<{}, {}, any>
  export const AdminHeader: DefineComponent<{}, {}, any>
  export const AdminSidebar: DefineComponent<{}, {}, any>
}

declare module '@/components/layouts/member-layout' {
  import { DefineComponent } from 'vue'

  export const MemberLayout: DefineComponent<{}, {}, any>
  export const MemberHeader: DefineComponent<{}, {}, any>
  export const MemberSidebar: DefineComponent<{}, {}, any>
}

declare module '@/components/layouts/staff-layout' {
  import { DefineComponent } from 'vue'

  export const StaffLayout: DefineComponent<{}, {}, any>
  export const StaffHeader: DefineComponent<{}, {}, any>
  export const StaffSidebar: DefineComponent<{}, {}, any>
}
