import { ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { file } from '../funciones/dinamicFiles/dinamicFiles';
import styles from '../funciones/styles.js/globalStyles';

const BackgroundImage = ({ children }) => {
  const arrePa = file().getArrePadre();
  const coor = useSelector((state) => state.coor); 

  // Default image (white background)
  let backgroundImage = 'https://res.cloudinary.com/dplncudbq/image/upload/v1656553545/mias/f1_queqlg.jpg';

  // Check if the object exists before trying to access its 'imagenAudio' property
  if (arrePa && arrePa.length > 0) {
    if (coor !== -1 && arrePa[coor]) {
      backgroundImage = arrePa[coor].imagenAudio;
    } else {
      backgroundImage = arrePa[0].imagenAudio;
    }
  }

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={[styles.backgroundImage.backgroundImageStyle]}
      blurRadius={15}
    >
      {children}
    </ImageBackground>
  );
};

export default BackgroundImage;
