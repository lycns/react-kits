import * as React from 'react'

export const AudioPlayer: React.FC = () => {
  const [source, setSource] = React.useState('')
  if (!source) {
    return null
  }
  return <audio />
}
