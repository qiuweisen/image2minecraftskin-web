export type ViewerModel = 'auto-detect' | 'default' | 'slim';

export const skinViewerConfig = {
  path: '/minecraft-skin-viewer',
  seo: {
    title: 'Minecraft Skin Viewer - Preview Skins in 3D Online',
    description:
      'Upload a 64x64 or 128x128 Minecraft skin PNG and preview it online in 2D and 3D. Free, private, and no account required.',
  },
  hero: {
    kicker: 'Minecraft Skin Viewer',
    title: 'Preview your Minecraft skin in 3D',
    description:
      'Check an existing Java or Bedrock skin before using it in-game. Upload the PNG, rotate the model, and inspect the unfolded texture in your browser.',
    facts: ['64x64 + 128x128', 'LOCAL PREVIEW', 'NO SIGNUP'],
  },
  workspace: {
    maxFileSizeBytes: 2 * 1024 * 1024,
    label: 'Minecraft skin preview workspace',
    title: 'Skin viewer',
    idle: 'Waiting for a skin',
    ready: 'Skin ready',
    uploadTitle: 'Drop a Minecraft skin PNG',
    uploadHint: '64x64 or 128x128 PNG - up to 2 MB',
    example: 'Try an example skin',
    reset: 'Reset viewer',
    localNote: 'Your skin is decoded and previewed in this browser.',
    modelLabel: 'Arm model',
    textureLabel: 'Unfolded skin texture',
    previewLabel: 'Interactive 3D Minecraft skin preview',
    emptyPreview: 'Upload a skin or try the example to start.',
    models: [
      { value: 'auto-detect', label: 'Auto' },
      { value: 'default', label: 'Classic' },
      { value: 'slim', label: 'Slim' },
    ] satisfies Array<{ value: ViewerModel; label: string }>,
  },
  explanation: {
    eyebrow: 'What is a skin viewer?',
    title: 'Inspect the texture before you equip it',
    description:
      'A Minecraft skin viewer renders the flat PNG texture on a player model, making it easier to catch incorrect dimensions, transparent areas, or the wrong arm style.',
  },
  steps: [
    {
      number: '01',
      title: 'Choose a skin PNG',
      description: 'Use an existing 64x64 Java or 128x128 Bedrock texture.',
    },
    {
      number: '02',
      title: 'Check the model',
      description: 'Use automatic arm detection or select Classic or Slim.',
    },
    {
      number: '03',
      title: 'Rotate and inspect',
      description:
        'Drag the 3D model and compare it with the unfolded texture.',
    },
  ],
  formats: [
    {
      size: '64',
      title: 'Java 64x64',
      description: 'The standard modern skin texture used by Java Edition.',
    },
    {
      size: '128',
      title: 'Bedrock 128x128',
      description: 'A higher-resolution square texture supported by Bedrock.',
    },
  ],
  faqs: [
    {
      question: 'Which Minecraft skin files can I preview?',
      answer:
        'The viewer accepts PNG textures sized 64x64 or 128x128 pixels. Other image formats and dimensions are rejected so the preview remains accurate.',
    },
    {
      question: 'Does the viewer upload my skin?',
      answer:
        'No. The standard viewer reads and renders the selected file in your browser without sending it to an upload endpoint.',
    },
    {
      question: 'What is the difference between Classic and Slim arms?',
      answer:
        'Classic skins use four-pixel-wide arms, while Slim skins use three-pixel-wide arms. Auto mode asks the renderer to detect the model from the texture.',
    },
    {
      question: 'Can I turn a normal photo into a skin here?',
      answer:
        'The viewer is for existing skin PNG files. Use the Image to Minecraft Skin generator on the homepage to convert a photo or character image first.',
    },
  ],
  cta: {
    eyebrow: 'Need a new skin?',
    title: 'Turn an image into a Minecraft skin.',
    description:
      'Use the generator to create a skin texture, then inspect the result in 2D and 3D.',
    button: 'Open the image converter',
  },
} as const;
