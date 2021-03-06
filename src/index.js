import './styles.css'
import feather from 'feather-icons'
import $ from 'jquery'
import watermark from './watermark'

feather.replace()

const download = true

var watermarkFile
var imageFile

$('#watermark-upload').on('change', () => {
  watermarkFile = $('#watermark-upload').prop('files')[0]
  console.log(`Selected: ${watermarkFile.name}`)
  updateUI()
  mark()
})

$('#image-upload').on('change', () => {
  imageFile = $('#image-upload').prop('files')[0]
  console.log(`Selected: ${imageFile.name}`)
  updateUI()
  mark()
})

function updateUI() {
  if (watermarkFile) {
    $('#watermark').addClass('selected')
  } else {
    $('#watermark').removeClass('selected')
  }

  if (imageFile) {
    $('#image').addClass('selected')
  } else {
    $('#image').removeClass('selected')
  }
}

function mark() {
  if (!watermarkFile || !imageFile) return

  const imageName = imageFile.name.split('.')[0]

  const watermarkPosition = $('#cornerSelect').val()

  $('#loadingIndicator').fadeIn()

  var drawFnc = () => {
    const alpha = 0.8

    switch (watermarkPosition) {
      case 'upperLeft':
        return watermark.image.upperLeft(alpha)
      case 'upperRight':
        return watermark.image.upperRight(alpha)
      case 'lowerLeft':
        return watermark.image.lowerLeft(alpha)
      default:
        return watermark.image.lowerRight(alpha)
    }
  }

  watermark([imageFile, watermarkFile])
    .image(drawFnc())
    .then(img => {
      const $img = $(img)
      const base64String = $img.attr('src')

      if (download) {
        const a = document.createElement('a')
        a.href = base64String
        a.download = imageName + '.watermarked.png'
        a.click()
      } else {
        console.log('Done')
      }

      imageFile = undefined
      $('#image-upload').val(null)

      $('#loadingIndicator').fadeOut()

      updateUI()
    })
}

updateUI()
