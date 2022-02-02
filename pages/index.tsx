import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import groq from 'groq'

import client from '../client'
import Carousel from '../components/Carousel'
import Layout from '../containers/Layout'
import NewsCard from '../components/NewsCard'
import RoundButton from '../components/RoundedButton'
import Link from '../components/Link'
import UpcomingBanner from '../components/UpcomingBanner'
import RotatedText from '../components/RotatedText'
import EventCard from '../components/EventCard'

import { projectsDetails, projects, home as fixture } from '../fixtures'
import {
  Event,
  News,
  Project,
  ProjectDetails,
  UpcomingProject,
  HomeDetails,
  Artwork
} from '../types'
import styles from './Home.module.scss'

interface HomeProps {
  news: News[]
  events: Event[]
  upcoming: UpcomingProject
  project: Project
  artworks: Artwork[]
}

const DynamicPixelHero = dynamic(() => import('../components/PixelHero'))

const Home: NextPage<HomeProps> = ({ news, events, project, upcoming, artworks }) => {
  const items = artworks.slice(0, 100) || []
  const carouselItems = events.map((ev, i) => (
    <Link key={`eventcard-${i}`} href={`/event/${ev.slug.current}`}>
      <EventCard {...ev} />
    </Link>
  ))

  return (
    <Layout greyBG>
      <Head>
        <title>FINE</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.heroWrapper}>
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.rotatedWrapper}>
              <div className={styles.rotatedSubtitle}>
                <h5>NEW PROJECT</h5>
              </div>
            </div>
            <h2 className={styles.projectName}>{project.title}</h2>
          </div>
          <div className={styles.bottom}>
            <div className={styles.buttonWrapper}>
              <Link href={`/collection/${project.slug.current}`} scroll>
                <RoundButton size="xl">GO</RoundButton>
              </Link>
            </div>
            <div className={styles.artistName}>By {project.artist.name}</div>
          </div>
        </div>

        <DynamicPixelHero items={items} />
      </section>
      <section className={styles.newsAndEventsWrapper}>
        <div className={styles.subtitleWrapper}>
          <RotatedText>NEWS & EVENTS</RotatedText>
        </div>
        <div className={styles.eventsWrapper}>
          <div className={styles.carouselWrapper}>
            <Carousel items={carouselItems} />
          </div>
        </div>
        <div className={styles.newsWrapper}>
          <div className={styles.newsCardWrapper}>
            {news?.map((n, i) => (
              <Link href={`/news/${n.slug.current}`} key={`${n.title}${i}`}>
                <NewsCard title={n.title} mainImage={n.mainImage} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      {upcoming && <UpcomingBanner project={upcoming} />}
      <section className={styles.circle}>
        <div className={styles.shape}>
          <p>upcoming...</p>
          <h4 className={styles.content}>Collector&apos;s Circle</h4>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const news = await client.fetch(groq`
    *[_type == "post" && publishedAt < now()] | order(publishedAt desc) {
      title, mainImage, slug
    }[0...5]
  `)
  const events = await client.fetch(groq`
    *[_type == "event" && publishedAt < now()] | order(publishedAt desc) [0...3]
  `)

  const data = await client.fetch(groq`
  *[_type == "home"]{
    "project": {
      "title": featuredProject->title,
      "slug": featuredProject->slug,
     "artist":{ "name": featuredProject->artist->name,}
      },
    "title":upcomingProjectTitle,
    "name":upcomingProjectArtist->name,
    "dropDate":upcomingProjectDrop,
    "overview":upcomingProjectOverview,
    "image":upcomingProjectImage,
  }[0]`)

  // TODO: FETCH ARTWORKS FROM BE (OPENSEA ?)
  const fetchedProject = projects.find(proj => proj.slug.current === data.project.slug.current)
  const artworks = fetchedProject?.artworks

  return {
    props: {
      news,
      events,
      project: data.project,
      artworks,
      projectDetails: projectsDetails[0],
      upcoming: data
    },
    revalidate: 10
  }
}

export default Home
