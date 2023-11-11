const initialState = {
  audioCurrentTime: 0,
  audioDuration: 0, 
  isPlaying:  'false', 
  coor: -1, 
  soundObject: 0, 
  actualScreen: 'Login',
  bitRate: '50k',
  nextActionAudio: 'next',
  mode: 'light',
  audioLike: [],
  tags: [], 
  arreObjectContent: []//todabia no esta en uso
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_IS_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,} 
    case 'UPDATE_AUDIO_CURRENT_TIME':
      return {
        ...state,
        audioCurrentTime: action.payload, 
      }; 
    case 'UPDATE_AUDIO_DURATION':
      return {
        ...state,
        audioDuration: action.payload, 
      };   
    case 'UPDATE_COOR':
      return {
        ...state,
        coor: action.payload, 
      };  
    case 'UPDATE_SOUNDOBJECT':
      return {
        ...state,
        soundObject: action.payload, 
      };  
    case 'UPDATE_ACTUALSCREEN':
      return {
        ...state,
        actualScreen: action.payload, 
      };
    case 'UPDATE_BITRATE':
      return {
        ...state,
        bitRate: action.payload, 
      };      
    case 'UPDATE_NEXT_ACTION_AUDIO':
      return {
        ...state,
        nextActionAudio: action.payload, 
      };     
    case 'UPDATE_MODE':
      return {
        ...state,
        mode: action.payload, 
      };
    case 'UPDATE_AUDIO_LIKE':
        return {
          ...state,
          audioLike: action.payload, 
        };    
    case 'UPDATE_TAGS':
        return {
          ...state,
          tags: action.payload, 
        };      
    case 'UPDATE_ARRE_OBJECT_CONTENT':
        return {
          ...state,
          arreObjectContent: action.payload, 
        };                           
    default:
      return state;
  }
};

export default counterReducer;
