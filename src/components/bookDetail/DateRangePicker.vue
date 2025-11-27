<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
    <!-- Month/Year Navigation -->
    <div class="flex items-center justify-between mb-4">
      <button
        @click="previousMonth"
        class="p-2 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
        title="Bulan sebelumnya"
      >
        ◀
      </button>
      <h3 class="text-white font-semibold min-w-[200px] text-center">
        {{ monthName }} {{ currentYear }}
      </h3>
      <button
        @click="nextMonth"
        class="p-2 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
        title="Bulan berikutnya"
      >
        ▶
      </button>
    </div>

    <!-- Weekday Header -->
    <div class="grid grid-cols-7 gap-2 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-gray-400 text-sm font-medium py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="day in calendarDays"
        :key="`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`"
        @click="selectDate(day.date)"
        :class="getDayClasses(day)"
        class="aspect-square flex items-center justify-center rounded-lg cursor-pointer font-medium text-sm transition-all"
      >
        {{ day.date.getDate() }}
      </div>
    </div>

    <!-- Selected Range Summary -->
    <div v-if="startDate || endDate" class="mt-4 p-3 bg-gray-700 rounded-lg text-gray-300 text-sm">
      <div v-if="startDate" class="flex justify-between">
        <span>Tanggal Mulai:</span>
        <span class="text-blue-400 font-semibold">{{ formatDate(startDate) }}</span>
      </div>
      <div v-if="endDate" class="flex justify-between mt-1">
        <span>Tanggal Akhir:</span>
        <span class="text-blue-400 font-semibold">{{ formatDate(endDate) }}</span>
      </div>
      <div v-if="startDate && endDate" class="flex justify-between mt-2 text-blue-300">
        <span>Durasi:</span>
        <span class="font-semibold">{{ calculateDuration() }} hari</span>
      </div>
    </div>

    <!-- Reset Button -->
    <button
      v-if="startDate || endDate"
      @click="resetDates"
      class="w-full mt-3 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
    >
      Reset Tanggal
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  startDate: Date | null
  endDate: Date | null
}

interface Emits {
  (e: 'update-start-date', date: Date | null): void
  (e: 'update-end-date', date: Date | null): void
}

const { startDate, endDate } = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentDate = ref(new Date())

const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const monthName = computed(() => monthNames[currentMonth.value])

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

  // Hari dari bulan sebelumnya
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    })
  }

  // Hari di bulan ini
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    })
  }

  // Hari dari bulan berikutnya
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    })
  }

  return days
})

const getDayClasses = (day: { date: Date; isCurrentMonth: boolean }) => {
  const dateStr = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`
  const startDateStr = startDate
    ? `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`
    : null
  const endDateStr = endDate
    ? `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`
    : null

  const isStart = dateStr === startDateStr
  const isEnd = dateStr === endDateStr
  const isInRange = startDate && endDate && day.date > startDate && day.date < endDate

  let classes = 'transition-all '

  if (!day.isCurrentMonth) {
    classes += 'text-gray-500 opacity-50 cursor-default hover:bg-transparent '
  } else {
    classes += 'text-white hover:bg-gray-700 '
  }

  if (isStart || isEnd) {
    classes += 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/50 '
  } else if (isInRange) {
    classes += 'bg-blue-500/40 text-blue-100 border border-blue-500/50 '
  }

  if (!day.isCurrentMonth) {
    classes = classes.replace('hover:bg-gray-700', '')
  }

  return classes
}

const selectDate = (date: Date) => {
  // Jika belum ada startDate, set startDate
  if (!startDate) {
    emit('update-start-date', date)
    return
  }

  // Jika startDate sudah ada tapi belum endDate
  if (startDate && !endDate) {
    if (date < startDate) {
      // Jika tanggal yang dipilih lebih awal dari startDate, tukar posisinya
      emit('update-start-date', date)
      emit('update-end-date', startDate)
    } else if (date.getTime() === startDate.getTime()) {
      // Jika sama dengan startDate, reset
      emit('update-start-date', null)
    } else {
      // Jika lebih besar dari startDate, set sebagai endDate
      emit('update-end-date', date)
    }
    return
  }

  // Jika sudah ada keduanya, reset dan mulai dari awal
  if (startDate && endDate) {
    emit('update-start-date', date)
    emit('update-end-date', null)
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const resetDates = () => {
  emit('update-start-date', null)
  emit('update-end-date', null)
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

const calculateDuration = () => {
  if (!startDate || !endDate) return 0
  const time = endDate.getTime() - startDate.getTime()
  return Math.ceil(time / (1000 * 60 * 60 * 24)) + 1
}

// Menggunakan computed untuk meng-handle props yang nullable
const wrappedStartDate = computed(() => startDate)
const wrappedEndDate = computed(() => endDate)
</script>
