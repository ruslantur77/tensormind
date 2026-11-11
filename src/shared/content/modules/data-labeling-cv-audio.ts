import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const dataLabelingMeta: ModuleMeta = {
  id: 'data-labeling-cv-audio',
  title: {
    ru: 'Подготовка, разметка данных и аугментации (CV & Audio)',
    en: 'Data Labeling, Audio/CV Annotation & Augmentations',
  },
  description: {
    ru: 'Полный пайплайн подготовки данных для обучения: инструменты разметки (Label Studio, CVAT, Whisper), форматы аннотаций (COCO, YOLO, VOC), аугментации изображений (Albumentations, MixUp/CutMix), аугментации звука (torchaudio, SpecAugment) и Active Learning.',
    en: 'Complete data preparation pipeline: annotation tools (Label Studio, CVAT, Whisper), bounding box & segmentation formats (COCO, YOLO, VOC), vision augmentations (Albumentations, MixUp/CutMix), audio augmentations (torchaudio, SpecAugment), and Active Learning.',
  },
  order: 14,
  icon: 'data-labeling-cv-audio',
  estimatedMinutes: 85,
  isPlaceholder: false,
};

export const dataLabelingLessons: Lesson[] = [
  {
    id: 'labeling-1-tools-formats',
    moduleId: 'data-labeling-cv-audio',
    title: {
      ru: 'Инструменты разметки и форматы данных: Label Studio, CVAT, COCO, YOLO, аудио',
      en: 'Annotation Tools & Formats: Label Studio, CVAT, COCO, YOLO, Audio',
    },
    order: 1,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Роль качественной разметки в Data-Centric AI
В современной парадигме Data-Centric AI (сформулированной Эндрю Ыном) улучшение качества данных часто дает значительно больший прирост метрик, чем усложнение архитектуры нейросети. «Garbage in, garbage out» — фундаментальный закон машинного обучения.

---

#### 1. Индустриальные инструменты разметки
* **Label Studio (Heartex / HumanSignal):** Универсальная open-source платформа с поддержкой изображений, аудио, текста, таймсерий и мультимодальных данных. Легко разворачивается в Docker и поддерживает подключение ML-бэкенда для Pre-labeling (авторазметки моделями).
* **CVAT (Computer Vision Annotation Tool):** Золотой стандарт для разметки видео и фото: полигоны для сегментации, 3D кубоиды, трекинг объектов между кадрами (интерполяция боксов).
* **Разметка аудио и речи:**
  * **Whisper / Wav2Vec2 Pre-annotation:** Использование модели распознавания речи для первичной транскрипции с последующей ручной коррекцией разметчиками.
  * **Аудио-сегментация:** Разметка временных меток (Start, End), меток спикеров (Speaker Diarization) и фоновых шумов (VAD — Voice Activity Detection).
  * **Спектрограммная разметка:** Разметка звуковых событий (Audio Event Detection) в частотно-временных координатах (Bounding Boxes на мел-спектрограммах).

---

#### 2. Форматы разметки в Computer Vision

##### Формат YOLO (.txt)
Один текстовый файл на каждое изображение. Каждая строка содержит:
\`\`\`bash
class_id x_center y_center width height
\`\`\`
Все координаты нормализованы от 0.0 до 1.0 относительно ширины и высоты исходного изображения:
\`\`\`
0 0.512 0.380 0.224 0.410
1 0.720 0.610 0.150 0.205
\`\`\`

##### Формат COCO (.json)
Единый JSON-файл для всего датасета со строгой иерархией \`images\`, \`annotations\`, \`categories\`:
\`\`\`json
{
  "images": [
    { "id": 1, "file_name": "img_001.jpg", "width": 1920, "height": 1080 }
  ],
  "annotations": [
    {
      "id": 101,
      "image_id": 1,
      "category_id": 3,
      "bbox": [xmin, ymin, width, height],
      "area": 45200.0,
      "segmentation": [[x1, y1, x2, y2, x3, y3]],
      "iscrowd": 0
    }
  ],
  "categories": [
    { "id": 3, "name": "car", "supercategory": "vehicle" }
  ]
}
\`\`\`
*Внимание:* В COCO бокс задается абсолютными пикселями $[x_{\\min}, y_{\\min}, \\text{width}, \\text{height}]$, в отличие от нормализованного центра в YOLO!

##### Формат Pascal VOC (.xml)
XML-файл на каждое изображение с абсолютными границами:
\`\`\`xml
<bndbox>
  <xmin>120</xmin>
  <ymin>80</ymin>
  <xmax>350</xmax>
  <ymax>410</ymax>
</bndbox>
\`\`\`

---

#### 3. Конвертация форматов на Python
При обучении моделей часто приходится преобразовывать форматы на лету:
\`\`\`python
def coco_to_yolo(bbox_coco, img_w, img_h):
    xmin, ymin, w, h = bbox_coco
    x_center = (xmin + w / 2.0) / img_w
    y_center = (ymin + h / 2.0) / img_h
    norm_w = w / img_w
    norm_h = h / img_h
    return [x_center, y_center, norm_w, norm_h]
\`\`\`
`,
      en: `### The Role of Quality Labeling in Data-Centric AI
In modern Data-Centric AI, improving data quality yields far greater gains than simply scaling model architecture.

---

#### 1. Industry Annotation Platforms
* **Label Studio:** Multi-modal open-source platform supporting images, audio, text, and time series with ML pre-labeling backends.
* **CVAT:** The computer vision benchmark for video/image object tracking, polygons, and 3D cuboids.
* **Audio & Speech Annotation:** Whisper pre-transcription, time-aligned phonemes, speaker diarization, and Voice Activity Detection (VAD).

---

#### 2. Vision Annotation Formats
* **YOLO (.txt):** Normalized center coordinates: \`class_id x_center y_center width height\`.
* **COCO (.json):** Global JSON structure containing images, annotations, categories with absolute pixel boxes: \`[xmin, ymin, width, height]\`.
* **Pascal VOC (.xml):** Per-image XML with \`[xmin, ymin, xmax, ymax]\`.
`,
    },
    commonMistakes: [
      {
        ru: 'Путаница между абсолютными координатами в пикселях (COCO: [xmin, ymin, w, h]) и нормализованными координатами центра (YOLO: [x_center, y_center, w, h]). Несоответствие приводит к искажению боксов.',
        en: 'Mixing up absolute pixel coordinates (COCO: [xmin, ymin, w, h]) with normalized center coordinates (YOLO: [x_center, y_center, w, h]).',
      },
      {
        ru: 'Забывать обновлять разметку полигонов и боксов при изменении разрешения или кропе изображения во время препроцессинга.',
        en: 'Forgetting to transform bounding box and polygon coordinates when resizing or cropping images during preprocessing.',
      },
      {
        ru: 'Разметка аудио без единого стандарта транскрипции (как писать числительные, аббревиатуры, междометия), что приводит к противоречиям в обучающей выборке ASR.',
        en: 'Inconsistent audio transcription guidelines (numerals vs words, fillers), causing contradictory targets for ASR models.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-lbl-1-1',
        question: {
          ru: 'В чем ключевое отличие координат ограничивающего прямоугольника (Bounding Box) в формате YOLO от формата COCO?',
          en: 'What is the key difference between bounding box coordinates in YOLO and COCO format?',
        },
        options: [
          'В YOLO координаты нормализованы (0..1) и задают центр и размеры (x_center, y_center, w, h), а в COCO — абсолютные пиксели [xmin, ymin, w, h]',
          'В YOLO используются полярные координаты, а в COCO — декартовы',
          'В COCO координаты всегда начинаются от правого нижнего угла изображения',
          'В YOLO координаты всегда задаются только углами [xmin, ymin, xmax, ymax] в абсолютных пикселях',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Формат YOLO хранит относительные (от 0 до 1) координаты центра объекта и его относительные ширину и высоту, тогда как COCO хранит абсолютные пиксельные значения верхнего левого угла [xmin, ymin] и размера [width, height].',
          en: 'YOLO stores normalized (0 to 1) center coordinates and dimensions [x_center, y_center, w, h], while COCO stores absolute top-left pixel coordinates and dimensions [xmin, ymin, w, h].',
        },
      },
      {
        id: 'q-lbl-1-2',
        question: {
          ru: 'Что такое Pre-labeling (предварительная разметка) в инструментах вроде Label Studio или CVAT?',
          en: 'What is Pre-labeling in tools like Label Studio or CVAT?',
        },
        options: [
          'Генерация черновой разметки ML-моделью для последующей быстрой верификации и корректировки человеком',
          'Удаление всех некачественных изображений до начала процесса разметки',
          'Полная замена человека моделью без проверки разметчиком',
          'Конвертация датасета из формата PNG в JPEG',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Pre-labeling позволяет предобученной модели разметить черновики (боксами, масками или текстом), после чего асессор лишь исправляет ошибки, что ускоряет разметку в 3–5 раз.',
          en: 'Pre-labeling uses a model to generate initial annotations, allowing human annotators to verify and correct them, speeding up annotation 3-5x.',
        },
      },
      {
        id: 'q-lbl-1-3',
        question: {
          ru: 'Какая задача при разметке аудиоданных называется Speaker Diarization (диаризация спикеров)?',
          en: 'What audio labeling task is called Speaker Diarization?',
        },
        options: [
          'Определение того, «кто когда говорил» на аудиозаписи с разделением временных интервалов по дикторам',
          'Удаление шума и реверберации из аудиодорожки',
          'Преобразование частоты дискретизации из 44.1 кГц в 16 кГц',
          'Определение эмоционального окраса фразы без транскрипции',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Диаризация спикеров (Speaker Diarization) решает задачу «who spoke when», сегментируя аудиопоток на интервалы и присваивая каждому интервалу идентификатор говорящего (Speaker 1, Speaker 2 и т.д.).',
          en: 'Speaker Diarization answers "who spoke when" by segmenting speech and assigning timestamps to individual speaker IDs.',
        },
      },
    ],
  },
  {
    id: 'labeling-2-cv-augmentations',
    moduleId: 'data-labeling-cv-audio',
    title: {
      ru: 'Аугментации компьютерного зрения: Albumentations, MixUp, CutMix и Mosaic',
      en: 'Vision Augmentations: Albumentations, MixUp, CutMix & Mosaic',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Зачем нужны аугментации в Computer Vision?
Аугментация данных — это способ искусственного расширения обучающей выборки путем применения реалистичных искажений. Это предотвращает переобучение, делает модель инвариантной к поворотам, освещению, окклюзиям и ракурсам камеры.

---

#### 1. Библиотека Albumentations
\`Albumentations\` — де-факто стандарт в индустрии и соревнованиях Kaggle благодаря высочайшей производительности (написана на C++ и оптимизирована через OpenCV) и корректной синхронной обработке масок сегментации, ключевых точек (keypoints) и Bounding Boxes.

\`\`\`python
import albumentations as A
import cv2

transform = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.RandomBrightnessContrast(p=0.3),
    A.ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=15, p=0.5),
    A.CoarseDropout(max_holes=8, max_height=32, max_width=32, p=0.3),
    A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
], bbox_params=A.BboxParams(format='yolo', label_fields=['class_labels']))

# Одновременная трансформация картинки и боксов
transformed = transform(image=image, bboxes=bboxes, class_labels=class_labels)
aug_image = transformed['image']
aug_bboxes = transformed['bboxes']
\`\`\`

---

#### 2. Продвинутые техники смешивания изображений

##### MixUp (Zhang et al.)
Смешивает два случайных изображения $(x_i, x_j)$ и их one-hot метки $(y_i, y_j)$ с коэффициентом $\lambda \sim \text{Beta}(\alpha, \alpha)$:
$$\tilde{x} = \lambda x_i + (1 - \lambda) x_j, \quad \tilde{y} = \lambda y_i + (1 - \lambda) y_j$$
*Эффект:* Линеаризует поведение модели между классами, предотвращает оверконфидентные (чересчур самоуверенные) предсказания и калибрует вероятности.

##### CutMix (Yun et al.)
Вместо полупрозрачного наложения MixUp, CutMix вырезает прямоугольный патч из одного изображения и вставляет его в другое. Метки смешиваются пропорционально площади вырезанного патча:
$$\tilde{x} = \mathbf{M} \odot x_i + (\mathbf{1} - \mathbf{M}) \odot x_j, \quad \tilde{y} = \lambda y_i + (1 - \lambda) y_j$$
где $\mathbf{M}$ — бинарная маска прямоугольника, $\lambda = 1 - \frac{W_{\\text{box}} H_{\\text{box}}}{W H}$.
*Преимущество перед Dropout:* Пиксели не зануляются (что неестественно для фото), а заменяются полезной текстурой другого класса. Модель учится распознавать объекты по мелким деталям, когда большая часть скрыта.

##### Mosaic Augmentation (YOLOv4 / YOLOv5 / YOLOv8)
Сшивает 4 случайных изображения в одно полотно с общим смещенным центром. Боксы со всех 4 картинок пересчитываются на общее полотно.
*Преимущество:* Резко уменьшает масштаб объектов, имитируя множество мелких предметов, и позволяет модели в батче размера 16 фактически видеть 64 разных контекста, снижая потребность в огромном batch size.
`,
      en: `### Vision Augmentations: From Spatial Shifts to CutMix & Mosaic
Data augmentation expands effective dataset size and enforces visual invariance.

---

#### 1. Albumentations Framework
The gold-standard CV augmentation library that natively transforms images, bounding boxes, semantic masks, and keypoints simultaneously with high performance.

---

#### 2. Advanced Mixing Techniques
* **MixUp:** Linear interpolation of pixels and target labels: $\\tilde{x} = \\lambda x_i + (1-\\lambda) x_j$.
* **CutMix:** Pastes a patch from image B into image A; labels mixed proportional to bounding area.
* **Mosaic:** Stitches 4 training images into one composite image; dramatically helps small object detection.
`,
    },
    commonMistakes: [
      {
        ru: 'Применение случайного поворота (RandomRotation) на 90 градусов или Flip к изображениям рукописных цифр (например, цифры 6 и 9 превращаются друг в друга, ломая разметку).',
        en: 'Applying rotation or flip augmentations to asymmetrical classes (e.g., turning digit 6 into 9 or reversing left/right traffic signs).',
      },
      {
        ru: 'Использование CutMix или MixUp с функцией потерь, которая ожидает жесткие целые классы (например, стандартный CrossEntropyLoss без поддержки soft labels / label smoothing).',
        en: 'Using MixUp/CutMix with loss functions that do not support fractional target distributions (soft labels).',
      },
      {
        ru: 'Применение аугментаций к тестовой или валидационной выборке (валидация должна отражать реальное неискаженное распределение, если только не используется TTA — Test-Time Augmentation).',
        en: 'Applying stochastic training augmentations to the validation set instead of keeping clean reference evaluation data.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-lbl-2-1',
        question: {
          ru: 'В чем ключевое отличие аугментации CutMix от классического MixUp?',
          en: 'What is the key difference between CutMix and classic MixUp?',
        },
        options: [
          'CutMix физически врезает прямоугольный фрагмент одного фото в другое, а MixUp делает полупрозрачное поэлементное взвешивание всех пикселей',
          'MixUp меняет только контрастность, а CutMix только размер изображения',
          'CutMix применим только к звуковым дорожкам, а MixUp — только к видео',
          'В CutMix метки классов всегда остаются строго бинарными (0 или 1)',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'MixUp производит линейную интерполяцию всех пикселей двух изображений, создавая «призрачные» полупрозрачные кадры. CutMix вырезает реальный патч из одной картинки и вставляет в другую, смешивая метки пропорционально площади патча.',
          en: 'MixUp performs pixel-wise alpha blending across images, while CutMix physically cuts a rectangular patch from one image and pastes it into another.',
        },
      },
      {
        id: 'q-lbl-2-2',
        question: {
          ru: 'Какую главную проблему при детекции объектов решает аугментация Mosaic (применяемая в YOLO)?',
          en: 'What primary problem in object detection does Mosaic augmentation solve?',
        },
        options: [
          'Она обучает модель эффективно распознавать мелкие объекты в разнообразном масштабе без необходимости гигантского batch size',
          'Она полностью устраняет необходимость использования видеокарт',
          'Она автоматически размечает новые неразмеченные классы без участия человека',
          'Она заменяет все сверточные слои на полносвязные',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Mosaic объединяет 4 изображения с разным масштабированием в одно, что обучает детектор распознавать объекты мелкого масштаба и обогащает батч разнообразными контекстами.',
          en: 'Mosaic stitches 4 differently scaled images into one frame, forcing the model to detect smaller objects across varied backgrounds in fewer batch iterations.',
        },
      },
      {
        id: 'q-lbl-2-3',
        question: {
          ru: 'Почему при аугментации датасетов детекции объектов нельзя использовать обычный cv2.resize без пересчета Bounding Boxes?',
          en: 'Why cannot plain image resizing be applied without recalculating bounding boxes?',
        },
        options: [
          'Потому что абсолютные координаты рамок останутся на старых позициях и перестанут соответствовать сместившимся объектам',
          'Потому что OpenCV автоматически удаляет все текстовые файлы разметки при вызове resize',
          'Потому что изменение размера картинки всегда меняет количество каналов с 3 на 1',
          'Потому что модель перестает сходиться из-за смены формата float на int',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'При изменении размера или кропе изображения координаты пикселей сдвигаются. Если не трансформировать рамки синхронно (как это делает Albumentations через bbox_params), разметка укажет на пустой фон.',
          en: 'Resizing or cropping transforms pixel coordinates; bounding boxes must be transformed synchronously, otherwise they point to empty background.',
        },
      },
    ],
  },
  {
    id: 'labeling-3-audio-augmentations',
    moduleId: 'data-labeling-cv-audio',
    title: {
      ru: 'Аугментации звука и речи: torchaudio, SpecAugment, Time Stretch и Pitch Shift',
      en: 'Audio & Speech Augmentations: torchaudio, SpecAugment, Time Stretch & Pitch Shift',
    },
    order: 3,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Особенности обработки и аугментации звука
Звуковой сигнал в сыром виде — это одномерная временная волна давления воздуха (Waveform, дискретизированная с частотой Sample Rate, например 16 кГц). Однако в большинстве моделей (ASR, аудио-классификация, распознавание эмоций) звук переводят в двумерную **мел-спектрограмму** (Mel-Spectrogram) с помощью оконного преобразования Фурье (STFT).

Аугментации звука делятся на два ключевых семейства:
1. **Во временной области (Waveform Domain)** — манипуляции с сырым звуковым сигналом.
2. **В частотно-временной области (Spectrogram Domain)** — манипуляции непосредственно с 2D-спектрограммой.

---

#### 1. Аугментации сырого сигнала (Waveform)
* **Добавление шума (Additive Noise / SNR):** Наложение белого шума, уличного шума или шума кафе с заданным соотношением сигнал/шум (SNR — Signal-to-Noise Ratio в дБ):
  $$\text{SNR}_{\text{dB}} = 10 \log_{10} \left( \frac{P_{\text{signal}}}{P_{\text{noise}}} \right)$$
* **Time Stretch (Растяжение/сжатие времени):** Изменение темпа речи без изменения высоты тона (pitch).
* **Pitch Shift (Сдвиг высоты тона):** Сдвиг частот голоса вверх или вниз (например, имитация детского или басовитого голоса) без изменения скорости речи.
* **Импульсный отклик помещения (RIR — Room Impulse Response):** Свертка исходной речи с импульсным откликом реальной комнаты для имитации реверберации и эха микрофона на расстоянии.

---

#### 2. SpecAugment (Google Brain, Park et al.)
SpecAugment произвел революцию в обучении систем распознавания речи (ASR, Whisper, Conformer). Вместо медленных искажений сырого аудио SpecAugment применяется непосредственно к **мел-спектрограмме** как к изображению:

1. **Time Masking (Маскирование времени):** $t$ последовательных временных шагов $[t_0, t_0 + t)$ зануляются (или заполняются средним значением). Модель учится восстанавливать смысл слова, даже если слог или звук проглочен или зашумлен.
2. **Frequency Masking (Маскирование частот):** $f$ последовательных частотных каналов $[f_0, f_0 + f)$ маскируются. Модель учится не привязываться к специфическим частотным обертонам конкретного диктора.
3. **Time Warping:** Локальное деформирование спектрограммы вдоль временной оси.

\`\`\`python
import torch
import torchaudio.transforms as T

# Создание пайплайна SpecAugment
time_masking = T.TimeMasking(time_mask_param=35)
freq_masking = T.FrequencyMasking(freq_mask_param=15)

# spec: тензор мел-спектрограммы [Batch, Channels, Freq, Time]
augmented_spec = freq_masking(spec)
augmented_spec = time_masking(augmented_spec)
\`\`\`

*Почему SpecAugment так популярен?*
Он вычисляется прямо на GPU в процессе создания батча, не требует повторного вычисления STFT и делает модель устойчивой к фонетическим пропускам.
`,
      en: `### Audio & Speech Augmentations: Waveform vs SpecAugment
Audio machine learning operates in either raw waveform space or 2D time-frequency spectrogram space.

---

#### 1. Waveform Domain Transforms
* **Additive Background Noise & SNR:** Injecting environmental noise with target Signal-to-Noise Ratio.
* **Time Stretch & Pitch Shift:** Decoupled tempo scaling and pitch adjustment.
* **Room Impulse Response (RIR):** Convolving audio with room reverberation profiles.

---

#### 2. SpecAugment
Introduced by Google Brain for ASR; operates directly on log-mel spectrograms by applying random rectangular frequency and time stripes masking. Computes efficiently on GPU.
`,
    },
    commonMistakes: [
      {
        ru: 'Случайное изменение частоты дискретизации (Sample Rate) аудиофайлов в батче без пересчета на единую частоту (например, смешение 16 кГц и 44.1 кГц ломает STFT-разрешение).',
        en: 'Mixing varying sample rates (16kHz vs 44.1kHz) within the same batch without resample preprocessing.',
      },
      {
        ru: 'Слишком широкие маски в SpecAugment, которые затирают целые слова или весь информативный диапазон формант речи, превращая обучение в шум.',
        en: 'Setting overly large mask widths in SpecAugment that destroy entire phonemes or fundamental speech frequencies.',
      },
      {
        ru: 'Применение Pitch Shift к задачам классификации музыкальных нот или тональных языков, где высота звука напрямую определяет целевой класс.',
        en: 'Applying Pitch Shift to pitch-sensitive tasks (music transcription or tonal languages) where frequency directly defines the target class.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-lbl-3-1',
        question: {
          ru: 'К какому представлению аудиоданных применяется аугментация SpecAugment?',
          en: 'To which audio data representation is SpecAugment applied?',
        },
        options: [
          'Непосредственно к мел-спектрограмме (2D частотно-временной матрице) путем маскирования полос времени и частоты',
          'Только к сжатому MP3-файлу до его декодирования',
          'К сырому одномерному звуковому сигналу (Waveform) путем обрезки сэмплов',
          'К текстовой транскрипции диалога',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'SpecAugment работает прямо на уровне мел-спектрограммы, накладывая маскирующие полосы по частотной и временной осям, что делает модель устойчивой к потере частей спектра.',
          en: 'SpecAugment operates directly on 2D spectrogram representations, masking horizontal frequency bands and vertical time slices.',
        },
      },
      {
        id: 'q-lbl-3-2',
        question: {
          ru: 'Что выражает метрика SNR (Signal-to-Noise Ratio), используемая при наложении шума на аудио?',
          en: 'What does the SNR (Signal-to-Noise Ratio) metric express when adding noise to audio?',
        },
        options: [
          'Отношение мощности полезного сигнала к мощности шума, измеряемое в децибелах (дБ)',
          'Количество секунд паузы между словами диктора',
          'Скорость передачи данных в аудио-кодеке',
          'Число каналов в аудиозаписи (моно или стерео)',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'SNR (Signal-to-Noise Ratio) показывает логарифмическое соотношение мощности чистого сигнала к мощности помехи: высокий SNR означает чистый звук, низкий (или отрицательный) — сильный шум.',
          en: 'SNR is the ratio of signal power to noise power in decibels (dB); lower SNR indicates heavier noise corruption.',
        },
      },
      {
        id: 'q-lbl-3-3',
        question: {
          ru: 'Какая аугментация позволяет симулировать эффект нахождения диктора в большом гулком помещении (эхо, отражения от стен)?',
          en: 'Which augmentation simulates recording in a large echoing room?',
        },
        options: [
          'Свертка с импульсным откликом помещения (Room Impulse Response, RIR)',
          'Time Masking',
          'Квантование до 8 бит',
          'One-Hot кодирование звука',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Свертка исходного чистого звука с импульсным откликом помещения (Room Impulse Response, RIR) физически точно моделирует реверберацию и отражения звука от поверхностей.',
          en: 'Convolving speech with a Room Impulse Response (RIR) physically simulates room reverberation and wall reflections.',
        },
      },
    ],
  },
  {
    id: 'labeling-4-active-synthetic',
    moduleId: 'data-labeling-cv-audio',
    title: {
      ru: 'Active Learning, синтетические данные и контроль качества (Kappa, IAA)',
      en: 'Active Learning, Synthetic Data & Annotation Quality (Kappa, IAA)',
    },
    order: 4,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Умная разметка: как не размечать терабайты вслепую
Разметка данных людьми — самый дорогой и медленный этап ML-проекта. Active Learning и синтетические данные позволяют сократить объем ручной работы в разы, концентрируясь только на самых ценных сэмплах.

---

#### 1. Активное обучение (Active Learning)
Вместо случайной выборки данных для разметки модель сама выбирает наиболее информативные объекты:
1. **Uncertainty Sampling (Сэмплирование по неопределенности):**
   * *Least Confidence:* Выбираем сэмплы, где вероятность топ-класса минимальна: $x^* = \\arg\\min_x \\max_y P(y|x)$.
   * *Margin Sampling:* Выбираем сэмплы с минимальной разницей между первым и вторым наиболее вероятными классами: $x^* = \\arg\\min_x [P(y_1|x) - P(y_2|x)]$.
   * *Entropy Sampling:* Выбираем сэмплы с максимальной энтропией предсказаний $H(x) = -\\sum P(y|x) \\log P(y|x)$.
2. **Query-by-Committee:** Ансамбль разных моделей голосует по сэмплам; на разметку человеку отправляются объекты с наибольшим разногласием комитета.

---

#### 2. Синтетические данные и аугментация через Generative AI
* **Синтез редких классов:** Использование Diffusion моделей (Stable Diffusion / FLUX) для генерации объектов в редких погодных условиях (ночь, сильный туман, обледенение), которых мало в реальных данных.
* **LLM-генерация текста:** Создание синонимичных перефразирований, синтетических диалогов и редких сущностей с помощью LLM с валидацией эвристиками.
* **3D-симуляторы (CARLA, Blender, Unity):** Идеально точная автоматическая разметка (Ground Truth Bounding Boxes, Depth Maps, Segmentation Masks) без участия людей.

---

#### 3. Метрики качества разметки (Inter-Annotator Agreement)
Если два разметчика смотрят на один и тот же объект, они должны приходить к одинаковому результату.

##### Каппа Коэна (Cohen's Kappa)
Для двух разметчиков, классифицирующих объекты по категориям:
$$\\kappa = \\frac{P_o - P_e}{1 - P_e}$$
где $P_o$ — наблюдаемое согласие (доля совпадений), $P_e$ — гипотетическое согласие при случайном угадывании на основе маргинальных частот.
* $\\kappa > 0.8$: Отличное согласие (разметка надежна).
* $\\kappa < 0.6$: Несогласованность инструкций, требуется пересмотр гайдлайнов.

##### Каппа Флейса (Fleiss' Kappa)
Обобщение метрики Коэна для ситуации, когда каждый объект размечается фиксированным числом асессоров из пула из $m$ человек.

##### Согласие по рамкам (Box IoU Agreement)
Для детекции согласие оценивается через пересечение поверх объединения (Intersection over Union):
$$\\text{IoU} = \\frac{\\text{Area of Overlap}}{\\text{Area of Union}}$$
Если $\\text{IoU} \\ge 0.75$, разметчики считаются согласованными по локализации объекта.
`,
      en: `### Smart Labeling: Active Learning, Synthetic Data & IAA
Human annotation is the cost bottleneck of machine learning.

---

#### 1. Active Learning Sampling Strategies
* **Uncertainty Sampling:** Least confidence, prediction margin, and prediction entropy.
* **Query-by-Committee:** Identifying points where an ensemble exhibits peak disagreement.

---

#### 2. Synthetic Data Generation
Diffusion models for rare weather, LLMs for synthetic text variants, and 3D simulation engines (CARLA, Blender) with pixel-perfect ground truth annotations.

---

#### 3. Inter-Annotator Agreement (IAA)
Cohen's Kappa and Fleiss' Kappa normalize observed agreement by chance agreement; bounding box agreement is assessed via IoU thresholds.
`,
    },
    commonMistakes: [
      {
        ru: 'Использование синтетических данных от нейросетей без фильтрации артефактов (галлюцинации LLM или анатомические ошибки диффузионных сетей загрязняют датасет).',
        en: 'Injecting synthetic generated data into training sets without quality filters, propagating generative hallucinations into downstream models.',
      },
      {
        ru: 'Оценка согласия разметчиков простой долей совпадений (Accuracy) без учета случайного угадывания при сильном дисбалансе классов (для этого необходима Каппа Коэна).',
        en: 'Relying on raw percentage agreement instead of Cohen/Fleiss Kappa when class distributions are strongly imbalanced.',
      },
      {
        ru: 'Запуск Active Learning без предварительного «холодного» сэмпла (Cold Start): модели необходим минимальный сбалансированный стартовый датасет для построения адекватных вероятностей.',
        en: 'Attempting Active Learning before collecting an initial diversified seed dataset to bootstrap meaningful model confidence.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-lbl-4-1',
        question: {
          ru: 'Какая стратегия Active Learning выбирает для ручной разметки сэмплы с минимальной разницей вероятностей между топ-1 и топ-2 предсказанными классами?',
          en: 'Which Active Learning strategy selects samples with the smallest gap between the top two class probabilities?',
        },
        options: [
          'Margin Sampling (выборка по запасу уверенности)',
          'Random Uniform Sampling',
          'Least Frequency Sampling',
          'SpecAugment Sampling',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Margin Sampling отбирает примеры, где модель колеблется между двумя наиболее вероятными вариантами: $P(y_1|x) - P(y_2|x) \\approx 0$. Это наиболее информативные граничные примеры.',
          en: 'Margin Sampling prioritizes points where the classifier is on the fence between its first and second choice, capturing ambiguous decision boundary cases.',
        },
      },
      {
        id: 'q-lbl-4-2',
        question: {
          ru: 'Зачем при оценке качества разметки используется Каппа Коэна ($\\kappa$) вместо простого процента совпадений ответов разметчиков?',
          en: 'Why is Cohen’s Kappa used instead of raw percentage agreement when evaluating annotation quality?',
        },
        options: [
          'Она делает поправку на вероятность случайного совпадения ответов асессоров',
          'Она автоматически исправляет ошибки в разметке без участия человека',
          'Она вычисляет время, затраченное каждым асессором на одну задачу',
          'Она применима только если все изображения черно-белые',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Каппа Коэна вычитает вероятность случайного совпадения ($P_e$). Если один класс встречается в 95% случаев, два случайных асессора совпадут в 90% случаев просто наугад; Каппа это учитывает.',
          en: 'Cohen’s Kappa corrects for chance agreement, which is essential when predominant classes allow annotators to agree by random guessing.',
        },
      },
      {
        id: 'q-lbl-4-3',
        question: {
          ru: 'Какое главное преимущество использования 3D-симуляторов (CARLA, Unity) для генерации обучающих данных автопилотов?',
          en: 'What is the main advantage of 3D simulators (CARLA, Unity) for autonomous driving training data?',
        },
        options: [
          'Безупречно точная автоматическая разметка (Ground Truth маски, глубина, боксы) и возможность симулировать редкие опасные аварийные сценарии',
          'Они полностью отменяют необходимость обучать нейросети',
          'Симуляторы работают прямо внутри браузера без видеокарты',
          'Сгенерированные изображения на 100% идентичны реальному миру во всех деталях',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Симуляторы дают бесплатную, абсолютно точную геометрию (Ground Truth координаты каждого пикселя) и позволяют безопасно отрабатывать опасные аварийные ситуации (пешеход выбегает под колеса в гололед).',
          en: 'Simulators provide mathematically exact ground-truth labels and allow safe simulation of critical edge cases (e.g., collision risks under harsh weather).',
        },
      },
    ],
  },
];

export const dataLabelingCards: Card[] = [
  {
    id: 'card-lbl-yolo-coco',
    moduleId: 'data-labeling-cv-audio',
    type: 'flip',
    front: {
      ru: 'В чем различие между форматами Bounding Box в COCO и YOLO?',
      en: 'What is the difference between bounding box representations in COCO vs YOLO?',
    },
    back: {
      ru: '**COCO**: абсолютные пиксели `[xmin, ymin, width, height]`.\n**YOLO**: нормализованные координаты центра и размеров от 0.0 до 1.0 `[x_center, y_center, width, height]`.',
      en: '**COCO**: absolute pixel values `[xmin, ymin, width, height]`.\n**YOLO**: normalized center coordinates & dimensions `[x_center, y_center, width, height]` (0.0 to 1.0).',
    },
    tags: ['cv', 'labeling', 'coco', 'yolo'],
  },
  {
    id: 'card-lbl-cutmix',
    moduleId: 'data-labeling-cv-audio',
    type: 'cloze',
    clozeText: {
      ru: 'Аугментация {{c1::CutMix}} вырезает прямоугольную область из изображения $B$ и вставляет в изображение $A$, смешивая метки пропорционально {{c2::площади вырезанного патча}}.',
      en: 'The {{c1::CutMix}} augmentation crops a rectangular region from image B and pastes it into image A, linearly blending targets proportional to the {{c2::cut patch area}}.',
    },
    answer: {
      ru: 'CutMix и площадь вырезанного патча',
      en: 'CutMix and cut patch area',
    },
    tags: ['cv', 'augmentations', 'cutmix'],
  },
  {
    id: 'card-lbl-specaugment',
    moduleId: 'data-labeling-cv-audio',
    type: 'flip',
    front: {
      ru: 'Что делает SpecAugment в задачах распознавания речи (ASR)?',
      en: 'What does SpecAugment do in speech recognition (ASR)?',
    },
    back: {
      ru: 'Маскирует (зануляет) случайные горизонтальные полосы **частот** (Frequency Masking) и вертикальные полосы **времени** (Time Masking) прямо на мел-спектрограмме аудиосигнала.',
      en: 'Directly masks random horizontal frequency stripes and vertical time slices on log-mel spectrogram representations.',
    },
    tags: ['audio', 'specaugment', 'asr'],
  },
  {
    id: 'card-lbl-active-learning',
    moduleId: 'data-labeling-cv-audio',
    type: 'cloze',
    clozeText: {
      ru: 'В парадигме Active Learning стратегия {{c1::Uncertainty Sampling}} отправляет асессорам для разметки те сэмплы, в которых модель имеет {{c2::наименьшую уверенность}} или наибольшую энтропию.',
      en: 'Under Active Learning, {{c1::Uncertainty Sampling}} routes samples where the model has the {{c2::lowest confidence}} or highest entropy to human annotators.',
    },
    answer: {
      ru: 'Uncertainty Sampling и наименьшая уверенность',
      en: 'Uncertainty Sampling and lowest confidence',
    },
    tags: ['active-learning', 'uncertainty'],
  },
];

export const dataLabelingQuiz: QuizQuestion[] = [
  {
    id: 'quiz-lbl-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какая библиотека аугментации для Computer Vision обеспечивает максимальную производительность и автоматическую синхронизацию меток боксов и масок?',
      en: 'Which CV augmentation library delivers maximum speed with automatic bounding box and mask synchronization?',
    },
    options: [
      { ru: 'Albumentations', en: 'Albumentations' },
      { ru: 'Matplotlib', en: 'Matplotlib' },
      { ru: 'NLTK', en: 'NLTK' },
      { ru: 'Pandas', en: 'Pandas' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Albumentations оптимизирована на C++ и OpenCV и имеет встроенную поддержку синхронной трансформации Bounding Boxes, полигонов и масок.',
      en: 'Albumentations is C++/OpenCV-accelerated and natively preserves target annotations during complex geometric transforms.',
    },
    tag: 'cv-augmentations',
  },
  {
    id: 'quiz-lbl-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Для чего в разметке звука применяется Voice Activity Detection (VAD)?',
      en: 'Why is Voice Activity Detection (VAD) applied in audio preprocessing?',
    },
    options: [
      {
        ru: 'Для автоматического отсечения участков тишины и фонового шума, выделяя только сегменты с человеческой речью',
        en: 'For automatically trimming silence and non-speech background, extracting speech segments',
      },
      { ru: 'Для распознавания пола говорящего', en: 'For speaker gender classification' },
      { ru: 'Для изменения высоты тона (Pitch Shift)', en: 'For applying Pitch Shift' },
      { ru: 'Для сжатия аудиофайла в FLAC без потерь', en: 'For compressing audio into lossless FLAC' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'VAD (Voice Activity Detection) детектирует интервалы наличия человеческой речи, позволяя вырезать длинные пустые паузы и экономить ресурсы при инференсе ASR.',
      en: 'VAD segments audio by identifying human voice presence versus silence or non-speech background noise.',
    },
    tag: 'audio-labeling',
  },
  {
    id: 'quiz-lbl-3',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Что означает значение Каппы Коэна $\\kappa = 0.85$ при оценке согласованности двух асессоров?',
      en: 'What does a Cohen’s Kappa of $\\kappa = 0.85$ indicate between two annotators?',
    },
    options: [
      {
        ru: 'Отличную согласованность разметчиков, существенно превосходящую случайное совпадение',
        en: 'Near-perfect inter-annotator agreement well beyond chance',
      },
      {
        ru: 'Полную несогласованность и необходимость заново переписать гайдлайн',
        en: 'Complete discordance requiring guideline rewrite',
      },
      { ru: 'Что разметчики допустили 85% ошибок', en: 'That annotators made 85% errors' },
      { ru: 'Что в датасете присутствует 85 дубликатов', en: 'That the dataset contains 85 duplicates' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Значение Каппы выше 0.80 свидетельствует о высокой степени согласия («Almost Perfect Agreement») с учетом поправки на случайность.',
      en: 'Values above 0.80 indicate strong, reliable agreement beyond random chance expectation.',
    },
    tag: 'labeling-quality',
  },
  {
    id: 'quiz-lbl-4',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Как аугментация MixUp модифицирует целевые переменные (labels) при обучении классификатора?',
      en: 'How does MixUp transform target labels during classifier training?',
    },
    options: [
      {
        ru: 'Создает взвешенную линейную комбинацию one-hot векторов двух классов (soft labels)',
        en: 'Creates a weighted linear combination of two one-hot vectors (soft labels)',
      },
      {
        ru: 'Случайно выбирает один из двух классов, игнорируя второй',
        en: 'Randomly chooses one class and ignores the other',
      },
      { ru: 'Заменяет метки на случайный шум', en: 'Replaces labels with uniform noise' },
      { ru: 'Переводит задачу в бинарную регрессию расстояния', en: 'Transforms task into distance regression' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'MixUp интерполирует не только пиксели, но и целевые распределения: $\\tilde{y} = \\lambda y_i + (1-\\lambda) y_j$, создавая мягкие вероятностные метки (soft labels).',
      en: 'MixUp linearly blends one-hot target vectors into soft probability distributions matching the pixel interpolation weight.',
    },
    tag: 'cv-augmentations',
  },
];
