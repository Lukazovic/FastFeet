import * as Yup from 'yup';
import { isAfter, isBefore } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const start_date = new Date();

    const availableStartDate = new Date().setHours(8, 0, 0, 0);
    const availableEndDate = new Date().setHours(22, 0, 0, 0);

    const isDeliveryDateValid =
      isBefore(availableStartDate, start_date) &&
      isAfter(availableEndDate, start_date);

    if (!isDeliveryDateValid) {
      return res.status(400).json({
        error:
          'You are only allowed to start a delivery between 08:00 and 18:00',
      });
    }

    const { recipient_id, deliveryman_id } = req.body;

    if (!(await Recipient.findByPk(recipient_id))) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Delivery.create({ ...req.body, start_date });

    return res.json(delivery);
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll();

    return res.json(deliveries);
  }

  async show(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res
        .status(404)
        .json({ error: 'No Delivery found with the given ID' });
    }

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Signature is required to end a delivery' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: req.params.id,
        end_date: null,
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    delivery.end_date = new Date();
    delivery.signature_id = req.body.signature_id;
    delivery.save();

    return res.json(delivery);
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res
        .status(404)
        .json({ error: 'No Delivery found with the given ID' });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'The Delivery is already canceled' });
    }

    delivery.canceled_at = new Date();
    delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryController();
