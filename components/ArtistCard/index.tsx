import { motion } from 'framer-motion'
import { useNextSanityImage } from 'next-sanity-image'
import Image from 'next/image'
import Link from 'next/link'
import client from '../../client'
import { fadeIn } from '../../styles/motionAnimations'
import { Artist } from '../../types'

import style from './style.module.scss'

interface ArtistCardProp {
  artist: Artist
}

const ArtistCard: React.FC<ArtistCardProp> = ({ artist }) => {
  const { slug, name, image } = artist
  const imageProps = useNextSanityImage(client, image)
  return (
    <motion.div variants={fadeIn} className={style.cardWrapper}>
      <Link href={`/artists/${slug.current}`} passHref>
        <div className={style.artistCard}>
          <div className={style.imageWrapper}>
            <Image layout="responsive" alt={`${name}-avatar`} {...imageProps} />
          </div>
        </div>
      </Link>
      <span className={style.artistName}>{name}</span>
    </motion.div>
  )
}

export default ArtistCard
