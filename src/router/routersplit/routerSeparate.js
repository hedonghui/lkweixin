import rank from '@/components/healthnav/rank'
import info from '@/components/healthnav/info'

export default [{
  path:'/rank',
  name:'rank',
  component:rank
},{
  path:'/info/:eId',
  name:'info',
  component:info
}
]
