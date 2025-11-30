import { computed } from 'vue'
import { getUserRole } from '@/utils/authMiddleware'

export type LayoutType = 'admin' | 'staff' | 'member'

/**
 * Composable to determine which layout to use based on user role
 */
export const useLayout = () => {
  const getLayout = (): LayoutType => {
    const role = getUserRole()

    switch (role) {
      case 'admin':
        return 'admin'
      case 'petugas':
        return 'staff'
      case 'anggota':
        return 'member'
      default:
        return 'admin' // Default fallback
    }
  }

  const layout = computed(() => getLayout())

  const isAdminLayout = computed(() => layout.value === 'admin')
  const isStaffLayout = computed(() => layout.value === 'staff')
  const isMemberLayout = computed(() => layout.value === 'member')

  return {
    layout,
    isAdminLayout,
    isStaffLayout,
    isMemberLayout,
    getLayout,
  }
}
