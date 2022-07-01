import React, { useEffect } from "react";
import { useTour } from '@reactour/tour'
import { case_control_steps, quantitative_steps } from "./gwassteps";
import { InfoCircleOutlined } from "@ant-design/icons";

const TourButton = ({stepInfo}) => {
    const { setIsOpen, setSteps, isOpen } = useTour()

    let current_steps = stepInfo.workflowName === "case control" ? case_control_steps : quantitative_steps

    useEffect(() => {
        setSteps(current_steps[stepInfo.step])
    }, [stepInfo])

    return (<InfoCircleOutlined onClick={() => {
        if (!isOpen) {
            setIsOpen(true)
        }
    }}
    style={{ fontSize: '25px', color: '#08c' }}
    ></InfoCircleOutlined>)
}

export default TourButton
