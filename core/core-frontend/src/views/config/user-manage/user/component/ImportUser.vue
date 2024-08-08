<template>
    <el-dialog title="批量导入" width="600">
        <div class="tooltip">
            <el-icon color="#3370ff">
                <InfoFilled />
            </el-icon>
            <div style="margin-left: 10px">请先</div>
            <el-link style="margin-left: 5px" type="primary" @click="downloadFile">下载模板</el-link>
            <div>，按要求填写后上传</div>
        </div>
        <div>
            <el-upload :limit="1" ref="upload" :on-exceed="handleExceed" :auto-upload="false" :on-change="fileChange">
                <el-input style="width: 550px" placeholder="点击选择文件">
                    <template #append><el-button icon="upload" /></template>
                </el-input>
                <template #tip>
                    <div class="el-upload__tip uploadTip">
                        仅支持xlsx、xls格式的文件
                    </div>
                </template>
            </el-upload>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="emits('cancelBtn')">取消</el-button>
                <el-button type="primary" @click="confirmImport"> 导入 </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { guid } from '@/views/visualized/data/dataset/form/util'
import { importUserApi, downExcelTemplateApi, } from '@/api/user'
import { ElMessage } from 'element-plus-secondary'
const emits = defineEmits(['cancelBtn'])
const upload = ref()
const currentFile = ref();
let confirmImport = () => {
    console.log(currentFile.value, 'currentFile.value');
    if (currentFile.value) {
        emits('cancelBtn')
        let param = new FormData();
        param.append("file", currentFile.value.raw)
        importUserApi(param).then((res) => {
            console.log(res), '批量导入上传';
            if (true) {
                ElMessage({
                    message: '上传成功！',
                    type: 'success'
                })
            }
        })
    }

}

let downloadFile = () => {
    downExcelTemplateApi().then(res => {
        console.log(res, '123123123');
        let blob = res.data
        let content = [];
        let fileName = '导入模板.xls'
        //  必须把blob内容放到一个数组里
        content.push(blob);
        getDownloadFile(content, fileName)
    })
}

//实例化文件流
const getDownloadFile = (data, fileName) => {
    const url = window.URL.createObjectURL(new Blob(data))
    const link = document.createElement('a')
    link.style.display = "none"
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    //下载完成移除元素
    document.body.removeChild(link)
    //释放掉blob对象
    window.URL.revokeObjectURL(url)
}

const handleExceed = (files) => {
    upload.value!.clearFiles()
    const file = files[0]
    file.uid = guid()
    upload.value!.handleStart(file)
}
const fileChange = (changeFile) => {
    if (isValidFileName(changeFile.name) == true) {
        if (changeFile.size > 10000000) {
            ElMessage.error('支持上传的文件大小，10M 以内.')
            upload.value!.clearFiles()
            return
        } else {
            currentFile.value = changeFile
            console.log(changeFile, currentFile.value.size);
        }
    } else {
        ElMessage.error('仅支持xlsx、xls格式的文件.')
        upload.value!.clearFiles()
    }
}
let isValidFileName = (fileName) => {
    // 检查文件名是否以.xls或.xlsx结尾
    var regex = /\.(xls|xlsx)$/i;;
    return regex.test(fileName);
}


</script>

<style lang="less" scoped>
.tooltip {
    display: flex;
    align-items: center;
    background-color: #e1eaff;
    border-radius: 4px;
    padding: 10px 15px;
    margin-bottom: 18px;
}

.uploadTip {
    margin-top: 5px;
    color: rgb(133, 133, 133);
}
</style>