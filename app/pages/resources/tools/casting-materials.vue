<script setup lang="ts">
import MaterialReferenceTool from '~/components/resources/MaterialReferenceTool.vue'
import { castingMaterials } from '~/data/forgingCastingMaterials'
import { resourcesCopy } from '~/data/resources'

const copy = resourcesCopy.castingMaterials

useSeoMeta({
  title: copy.seoTitle.fa,
  description: copy.description.fa,
  ogTitle: copy.seoTitle.en,
  ogDescription: copy.description.en,
  ogType: 'website',
})
</script>

<template>
  <MaterialReferenceTool :dataset="castingMaterials" :copy="copy" />
</template>
