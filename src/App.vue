<template>
  <div class="floor">
    <img class="floor__title" :src="title" alt="title1" @click="previewVisible = false" />
    <img class="floor__title2" :src="title2" alt="ttile2" />
    <div
      :class="[
        'floor__typing',
        {
          'floor__typing--preview': previewVisible,
        },
      ]"
    >
      <Transition name="fade">
        <div v-if="previewVisible" ref="previewRef" class="floor__typing-preview">
          <canvas class="floor__canvas" ref="canvasRef"></canvas>
          <p class="floor__en">{{ inputEn }}</p>
          <p class="floor__zh">{{ inputZh }}</p>
        </div>
        <div v-else class="floor__typing-flex">
          <div class="floor__typing-input">
            <div class="floor__typing-input-zh">
              <textarea
                class="floor__zh"
                v-model="inputZh"
                placeholder="输入地板练习的中文指令。"
                @keydown.enter="translate('en')"
              ></textarea>
              <div class="floor__loading" v-show="loading.zh">翻译中...</div>
            </div>
            <div
              class="floor__btn floor__typing-input-btn floor__zh"
              @click="translate('en')"
            >
              翻译成英文
            </div>
          </div>
          <div class="floor__typing-input">
            <div class="floor__typing-input-en">
              <textarea
                class="floor__en"
                v-model="inputEn"
                placeholder="Type instructions for FLOOR EXERCISES in English."
                @keydown.enter="translate('zh')"
              ></textarea>
              <div class="floor__loading" v-show="loading.en">Translating...</div>
            </div>
            <div
              class="floor__btn floor__typing-input-btn floor__en"
              @click="translate('zh')"
            >
              Translate to Chinese
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div class="floor__result">
      <Transition name="fade">
        <div class="floor__result-btn-group" v-if="previewVisible">
          <div class="floor__btn floor__result-left-btn" @click="previewVisible = false">
            <span class="floor__result-left-btn-arrow"><</span>
            <div class="floor__zh">返回修改</div>
            <div class="floor__en">Back and Modify</div>
          </div>
          <div class="floor__btn floor__result-right-btn" @click="confirmPrint()">
            <div class="floor__zh">确认打印</div>
            <div class="floor__en">Confirm and Print</div>
            <span class="floor__result-right-btn-arrow">></span>
          </div>
        </div>
        <div class="floor__result-btn-group" v-else>
          <div class="floor__btn floor__result-right-btn" @click="showPreview()">
            <div class="floor__zh">生成指令并预览</div>
            <div class="floor__en">Generate Instruction</div>
            <span class="floor__result-right-btn-arrow">></span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import html2canvas from "html2canvas";
import { callPrinter } from "call-printer";
import MD5 from "md5";
import axios from "axios";
import title from "./assets/HOKO_WEB_Title.svg";
import title2 from "./assets/HOKO_WEB_Title_2.svg";

const inputZh = ref("");
const inputEn = ref("");
const previewVisible = ref(false);
const previewRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const loading = ref({
  en: false,
  zh: false,
});

const translate = async (lang: string) => {
  if (lang == "en" && !inputZh.value) {
    alert("请输入中文指令。");
  } else if (lang == "zh" && !inputEn.value) {
    alert("Please type instructions in English.");
  } else if (lang == "en") {
    loading.value.zh = true;
    try {
      const data: any = await translateApi(inputZh.value, "zh", "en");
      inputEn.value = data.trans_result[0].dst;
      loading.value.zh = false;
    } finally {
      loading.value.zh = false;
    }
  } else {
    loading.value.en = true;
    try {
      const data: any = await translateApi(inputEn.value, "en", "zh");
      inputZh.value = data.trans_result[0].dst;
      loading.value.en = false;
    } finally {
      loading.value.en = false;
    }
  }
};

const translateApi = (query: string, from: "zh" | "en", to: "zh" | "en") => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const appid = "20240508002045465";
    const key = "kKJZxIySKgFAX4bdfOhr";
    const salt = new Date().getTime();
    const str1 = appid + query + salt + key;
    const sign = MD5(str1);
    try {
      const { data } = await axios.get("/baiduApi/api/trans/vip/translate", {
        params: {
          q: query,
          appid,
          salt,
          from,
          to,
          sign,
        },
      });
      resolve(data);
    } catch (error) {
      alert("翻译失败，请稍后再试。");
    }
  });
};

const showPreview = () => {
  if (!inputZh.value && !inputEn.value) {
    alert("请先输入指令。");
  } else if (inputZh.value && !inputEn.value) {
    alert("请先翻译成英文。");
  } else if (!inputZh.value && inputEn.value) {
    alert("Please translate to Chinese first.");
  } else {
    previewVisible.value = true;
    nextTick(() => {
      const canvas = canvasRef.value;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      canvas.width = (previewRef.value?.offsetWidth ?? 0) * 6 || 0;
      canvas.height = (previewRef.value?.offsetHeight ?? 0) * 6 || 0;
      const points: {
        x: number;
        y: number;
      }[] = [];
      const random = Math.floor(Math.random() * 200 + 300);
      Array.from({ length: random }).forEach(() => {
        points.push({
          x: Math.random() * (canvas?.width ?? 0),
          y: Math.random() * (canvas?.height ?? 0),
        });
      });
      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        context.fillStyle = "black";
        context.fill();
      });
    });
  }
};

const confirmPrint = async () => {
  const preview = previewRef.value;
  if (!preview) return;
  const image = await html2canvas(preview, {
    scale: 6,
    useCORS: true,
  });
  const width = 29.7 * 37.795275591;
  const height = 21 * 37.795275591;
  callPrinter(
    `<img src="${image.toDataURL("image/png")}" width="${width}px" height="${height}px"/>`
  );
};

// onMounted(() => {
//   const canvas = canvasRef.value;
//   const context = canvas?.getContext("2d");
//   if (!canvas || !context) return;
//   canvas.width = previewRef.value?.offsetWidth * 6 || 0;
//   canvas.height = previewRef.value?.offsetHeight * 6 || 0;
//   const points: {
//     x: number;
//     y: number;
//   }[] = [];
//   const random = Math.floor(Math.random() * 200 + 300);
//   Array.from({ length: random }).forEach(() => {
//     points.push({
//       x: Math.random() * (canvas?.width ?? 0),
//       y: Math.random() * (canvas?.height ?? 0),
//     });
//   });
//   points.forEach((point) => {
//     context.beginPath();
//     context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
//     context.fillStyle = "black";
//     context.fill();
//   });
// });
</script>
