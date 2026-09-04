import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Expertise from '@/components/Expertise'
import Work from '@/components/Work'
import AgentArchitecture from '@/components/AgentArchitecture'
import BackendPlatform from '@/components/BackendPlatform'
import StackLayers from '@/components/StackLayers'
import AgentConsole from '@/components/AgentConsole'
import CalScheduler from '@/components/CalScheduler'
import Contact from '@/components/Contact'
import SiteFooter from '@/components/SiteFooter'

/**
 * Section ids live on the section elements inside each component, so there is
 * exactly one element per id and scroll-spy has a single target.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <Expertise />
        <Work />
        <AgentArchitecture />
        <BackendPlatform />
        <StackLayers />
        <AgentConsole />
        <CalScheduler />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
