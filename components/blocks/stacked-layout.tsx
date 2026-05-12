'use client'

// ============================================
// Imports
// ============================================
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Settings, X, Menu, Plus, Pencil, Box, Home, ChartNoAxesCombined } from 'lucide-react'
import { motion, MotionProps, Transition, AnimatePresence, stagger } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { CreateProjectDialog } from '../create-project-dialog'

// ============================================
// Config
// ============================================
const LINKS = [
  { text: 'Home', url: '/', icon: Home },
  { text: 'Analytics', url: '/analytics', icon: ChartNoAxesCombined },
  { text: 'My Habits', url: '/my-habits', icon: Box },
]

const OVERLAY_ANIMATION: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

const TABS_TRANSITION: Transition = {
  ease: [0.19, 1, 0.22, 1],
  duration: 0.5
}

const BUTTONS_ANIMATION: MotionProps = {
  initial: { filter: 'blur(4px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  exit: { filter: 'blur(4px)', opacity: 0, y: 20 },
  transition: {
    duration: 0.1 * LINKS.length,
    ease: [0.19, 1, 0.22, 1],
    delay: 0.7
  }
}

const ITEMS_CONTAINER_ANIMATION: MotionProps = {
  initial: "init",
  animate: "open",
  exit: "close",
  variants: {
    open: { transition: { delayChildren: stagger(0.07, { startDelay: 0.03 }) } },
    close: { transition: { delayChildren: stagger(0.05, { from: 'last' }) } },
  }
}

const ITEMS_ANIMATION: MotionProps = {
  variants: {
    init: { filter: 'blur(4px)', opacity: 0, y: 20 },
    open: { filter: 'blur(0px)', opacity: 1, y: 0 },
    close: { filter: 'blur(4px)', opacity: 0, y: 20 },
  },
  transition: {
    duration: 1.5,
    ease: [0.19, 1, 0.22, 1]
  }
}

// ============================================
// Types
// ============================================
interface StackedLayoutProps extends React.ComponentProps<'div'> { }

interface BodyProps {
  title: string
  children: React.ReactNode
}

// ============================================
// Main Component
// ============================================
function StackedLayout({ className, children, ...props }: StackedLayoutProps) {
  const pathName = usePathname()
  const [title, setTitle] = useState('')

  useEffect(() => {
    const currentLink = LINKS.find(link => link.url === pathName)
    setTitle(currentLink?.text || '')
  }, [pathName])

  return (
    <div
      {...props}
      className={cn("bg-background min-h-screen w-full", className)}
    >
      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <Body title={title} children={children} />
    </div>
  )
}

// ============================================
// Sub Components
// ============================================
function Navbar() {
  return (
    <div className="w-full h-16 border-b sticky top-0 bg-background/80 backdrop-blur-lg select-none isolate z-40">
      <div className='max-w-4xl mx-auto px-root-md sm:px-root-lg lg:px-root-2xl flex items-center justify-between h-full'>
        <DesktopNavbar />
        <MobileNavbar />
      </div>
    </div>
  )
}

function DesktopNavbar() {
  const pathName = usePathname()

  return (
    <div className="hidden lg:flex items-center justify-between w-full h-full">
      <div className='flex items-center justify-center gap-root-3xl h-full'>
        {/* Logo */}
        <Logo />

        {/* Nav links */}
        <nav className='h-full'>
          <ul className='flex items-center gap-root-xl h-full'>
            {LINKS.map(link => (
              <li key={link.text} className='relative h-full flex items-center'>
                <Link href={link.url} className={cn('font-medium transition-all hover:text-primary flex items-center [&_svg]:size-4 gap-root-sm', pathName === link.url ? 'text-primary' : 'text-muted-foreground')}>
                  <link.icon /> {link.text}
                </Link>

                {pathName === link.url && (
                  <motion.div
                    layoutId='underline'
                    layout
                    transition={TABS_TRANSITION}
                    className='absolute bottom-0 h-0.5 w-full bg-primary rounded-full'
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Actions */}
      <Actions />
    </div>
  )
}

function MobileNavbar() {
  const [isOpen, setOpen] = useState<boolean>(false)
  const pathName = usePathname()

  const handleClick = () => {
    setOpen(!isOpen)
  }

  return (
    <div className="flex lg:hidden items-center justify-between w-full h-full">
      {/* Logo */}
      <Logo />

      <div className="flex items-center gap-root-xl">
        {/* Buttons */}
        <div className="hidden sm:block">
          <Actions />
        </div>

        {/* Menu content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              {...OVERLAY_ANIMATION}
              className="fixed top-16 py-root-2xl px-root-lg left-0 w-full h-[calc(100vh-4rem)] bg-background will-change-transform space-y-root-2xl overflow-y-scroll no-scrollbar container"
            >
              {/* Links */}
              <motion.ul
                key='links'
                {...ITEMS_CONTAINER_ANIMATION}
                className="flex flex-col gap-root-md"
                role="navigation"
              >
                {LINKS.map(link => (
                  <motion.li {...ITEMS_ANIMATION} key={link.url} onClick={handleClick}>
                    <Link href={link.url}>
                      <Button
                        variant='ghost'
                        size='lg'
                        className={cn('text-xl', pathName === link.url ? 'text-foreground' : 'text-muted-foreground')}
                      >{link.text}</Button>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Buttons */}
              <motion.div {...BUTTONS_ANIMATION} key='mobile-menu-actions' className="block sm:hidden">
                <Actions />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu trigger */}
        <Button size='icon-lg' variant='outline' onClick={handleClick}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </div>
  )
}

function Actions() {
  const [createProjectOpen, setCreateProjectOpen] = useState<boolean>(false)

  return (
    <div className='flex items-center gap-root-sm'>
      <CreateProjectDialog isOpen={createProjectOpen} setOpen={setCreateProjectOpen} />

      <Button variant="outline" size="icon" className="text-muted-foreground" onClick={() => setCreateProjectOpen(true)}>
        <Plus />
      </Button>

      <ThemeToggle variant='outline' size="icon" className='text-muted-foreground' />
    </div>
  )
}

function Logo() {
  return (
    <Link href='/' className="text-2xl font-bold text-primary tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>DailyHabit</Link>
  )
}

function Body({ title, children }: BodyProps) {
  return (
    <div className="w-full max-w-4xl px-root-md sm:px-root-lg lg:px-root-2xl py-root-2xl space-y-root-xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tighter">{title}</h1>

      {/* Content */}
      {children}
    </div>
  )
}

// ============================================
// Export
// ============================================
export {
  StackedLayout
}