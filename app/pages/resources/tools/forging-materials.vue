<script setup lang="ts">
import MaterialReferenceTool from '~/components/resources/MaterialReferenceTool.vue'
import { forgingMaterials } from '~/data/forgingCastingMaterials'
import { resourcesCopy } from '~/data/resources'

const copy = resourcesCopy.forgingMaterials

useSeoMeta({
  title: copy.seoTitle.fa,
  description: copy.description.fa,
  ogTitle: copy.seoTitle.en,
  ogDescription: copy.description.en,
  ogType: 'website',
})
</script>

<template>
  <MaterialReferenceTool :dataset="forgingMaterials" :copy="copy" />
</template>
