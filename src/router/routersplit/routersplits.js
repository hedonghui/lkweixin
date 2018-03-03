//lmj
import healthMap from '@/components/healthnav/healthMaps.vue'
import searchSite from '@/components/healthnav/searchsite.vue'
import failureReporting from '@/components/healthnav/failureReporting.vue'

export default [{
  path: '/',
  name: 'healthMap',
  component: healthMap
}, {
  path: '/searchSite/:lng/:lat/:city',
  name: 'searchSite',
  component: searchSite
}, {
  path: '/failureReporting/:eId',
  name: 'failureReporting',
  component: failureReporting
}]
