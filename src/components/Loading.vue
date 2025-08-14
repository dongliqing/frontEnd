<template>
    <div class="flex ">
        <div class="point point1"></div>
        <div class="point point2"></div>
        <div class="point point3"></div>
    </div>
</template>

<style lang="less" scoped>
.point {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #f5f5f5;
    animation: twinkle 0.9s infinite;
    margin-right: 4px;
}

.point2 {
    animation-delay: 0.3s;
}

.point3 {
    animation-delay: 0.6s;
}

@keyframes twinkle {
    0% {
        background: #e6a23c;
    }
    100% {
        background: #faec8d;
    }
}

</style>
