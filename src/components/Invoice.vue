<template lang="pug">
    .invoice-row
        .invoice-date.field 作成日
        .invoice-issue.field 発行日
        .invoice-titile.field 表題
        .invoice-totalprice.field 金額
        .invoice-buttons.field
</template>

<style lang="sass" scoped>
@import 'src/sass/style'

.invoice-row
    margin-top: 1rem
    display: grid
    grid-template-areas: "date issue titile totalprice buttons"
    grid-template-columns: 1fr 1fr 4fr 1fr 1fr
    width: 65rem
    margin-left: auto
    margin-right: auto

    .field
        margin: .3rem
        display: grid
        align-items: center


        input, select
            height: 2rem
            padding: .3rem
            top: 50%
            border: .5px solid #555
            border-radius: .3rem
            width: 100%
        
    .invoice-date
        grid-area: date
    .invoice-issue
        grid-area: issue
    .invoice-titile
        grid-area: titile
    .invoice-totoalprice
        grid-area: totalprice
    .invoice-button
        grid-area: buttons
</style>